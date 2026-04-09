import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { dbConnect } from "../mongoose";
import { DocumentType } from "@typegoose/typegoose";

export class TodoItem {
  @prop({ required: true })
  text!: string;

  @prop({ default: false })
  completed!: boolean;

  @prop()
  completedAt?: Date;
}

export class TodoList {
  @prop({ required: true })
  name!: string;

  @prop({ type: () => [TodoItem], default: [] })
  items!: TodoItem[];

  @prop()
  createdBy?: string;

  @prop()
  createdAt?: Date;
}

export const TodoListModel =
  mongoose.models.TodoList ||
  getModelForClass(TodoList, {
    schemaOptions: { collection: "todolist" },
    options: { customName: "TodoList" },
  });

export interface TodoItemEntity extends TodoItem {
  id: string;
}

export interface TodoListEntity extends Omit<TodoList, "items"> {
  id: string;
  items: TodoItemEntity[];
}

function toEntity(doc: DocumentType<TodoList>): TodoListEntity {
  const obj = doc.toJSON() as unknown as {
    _id: unknown;
    items?: Array<{ _id: unknown } & Record<string, unknown>>;
  } & Record<string, unknown>;
  const { _id, items, ...rest } = obj;
  return {
    ...(rest as unknown as Omit<TodoList, "items">),
    id: String(_id),
    items: (items ?? []).map((item) => {
      const { _id: itemId, ...itemRest } = item;
      return { ...(itemRest as unknown as TodoItem), id: String(itemId) };
    }),
  };
}

export async function getTodoLists(): Promise<TodoListEntity[]> {
  await dbConnect();
  const lists = await TodoListModel.find({}).sort({ createdAt: -1 });
  return lists.map(toEntity);
}

export async function getTodoList(id: string): Promise<TodoListEntity | null> {
  await dbConnect();
  const list = await TodoListModel.findById(id);
  return list ? toEntity(list) : null;
}

export async function createTodoList(
  name: string,
  createdBy?: string
): Promise<TodoListEntity> {
  await dbConnect();
  const list = await TodoListModel.create({ name, createdBy, createdAt: new Date(), items: [] });
  return toEntity(list);
}

export async function deleteTodoList(id: string): Promise<void> {
  await dbConnect();
  await TodoListModel.findByIdAndDelete(id);
}

export async function addTodoItem(
  listId: string,
  text: string
): Promise<TodoListEntity | null> {
  await dbConnect();
  const list = await TodoListModel.findByIdAndUpdate(
    listId,
    { $push: { items: { text, completed: false } } },
    { returnDocument: "after" }
  );
  return list ? toEntity(list) : null;
}

export async function toggleTodoItem(
  listId: string,
  itemId: string,
  completed: boolean
): Promise<void> {
  await dbConnect();
  await TodoListModel.findOneAndUpdate(
    { _id: listId, "items._id": itemId },
    {
      $set: {
        "items.$.completed": completed,
        "items.$.completedAt": completed ? new Date() : undefined,
      },
    }
  );
}

export async function deleteTodoItem(
  listId: string,
  itemId: string
): Promise<void> {
  await dbConnect();
  await TodoListModel.findByIdAndUpdate(listId, {
    $pull: { items: { _id: itemId } },
  });
}
