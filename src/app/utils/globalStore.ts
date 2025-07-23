import SettingModel from "../model/Setting.model";
import dbConnect from "./dbConnect";

// ✅ Get SuperAdmin Status from DB
export async function getSuperAdminStatus(): Promise<boolean> {
  await dbConnect();
  const setting = await SettingModel.findOne({ key: "isSuperAdminCreated" });
  return setting ? setting?.value : false;
}

// ✅ Set SuperAdmin Status in DB
export async function setSuperAdminStatus(status: boolean): Promise<void> {
  await dbConnect();
  await SettingModel.updateOne(
    { key: "isSuperAdminCreated" },
    { value: status },
    { upsert: true }
  );
}

// ✅ Get ClientAdmin Status from DB
export async function getClientAdminStatus(): Promise<boolean> {
  await dbConnect();
  const setting = await SettingModel.findOne({ key: "isClientAdminCreated" });
  return setting ? setting?.value : false;
}

// ✅ Set ClientAdmin Status in DB
export async function setClientAdminStatus(status: boolean): Promise<void> {
  await dbConnect();
  await SettingModel.updateOne(
    { key: "isClientAdminCreated" },
    { value: status },
    { upsert: true }
  );
}
