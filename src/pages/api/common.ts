import { Schema } from "@/lib/lib";

interface HTTPError {
  status: number;
  message: string;
}

const MY_CMS_SECRET = "4c727a395c9c4c0a50696cfe095e36612934051b37ec178b2b1e74bbf36d4a66";
// const MY_CMS_SECRET = "12abwl312310af231k2j31";

type RequestBody =
  | { event: "items.create"; key: string; collection: keyof Schema }
  | { event: "items.update"; keys: string[]; collection: keyof Schema }
  | { event: "items.delete"; collection: keyof Schema };

export type { HTTPError, RequestBody };
export { MY_CMS_SECRET };
