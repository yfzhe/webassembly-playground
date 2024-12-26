import { z } from "zod";

import { WASM_FEATURES, type WasmFeature } from "./features";

type NonEmptyArray<T> = [T, ...T[]];

export const fileSchema = z.object({
  filename: z.string(),
  content: z.string(),
});

export const featureSchema = z.enum(
  WASM_FEATURES as NonEmptyArray<WasmFeature>,
);

export const featuresSchema = z.record(featureSchema, z.boolean());

export const projectSchema = z.object({
  files: z.array(fileSchema),
  features: featuresSchema,
});

export type File = z.infer<typeof fileSchema>;

export type WasmFeatures = z.infer<typeof featuresSchema>;

export type Example = {
  title: string;
  files: Array<File>;
  features?: WasmFeatures;
};
