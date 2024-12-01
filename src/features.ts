type FeatureConfigItem = {
  name: string;
  flag: string;
  // detector:
  isDefault: boolean;
};

export const WASM_FEATURES_LIST = [
  {
    name: "exceptions",
    flag: "exceptions",
    isDefault: false,
  },
  {
    name: "mutable globals",
    flag: "mutable_globals",
    isDefault: true,
  },
  {
    name: "saturating float to int",
    flag: "sat_float_to_int",
    isDefault: true,
  },
  {
    name: "sign extension",
    flag: "sign_extension",
    isDefault: true,
  },
  {
    name: "simd",
    flag: "simd",
    isDefault: true,
  },
  {
    name: "threads",
    flag: "threads",
    isDefault: false,
  },
  {
    name: "function references",
    flag: "function_references",
    isDefault: false,
  },
  {
    name: "multi value",
    flag: "multi_value",
    isDefault: true,
  },
  {
    name: "tail call",
    flag: "tail_call",
    isDefault: false,
  },
  {
    name: "bulk memory",
    flag: "bulk_memory",
    isDefault: true,
  },
  {
    name: "reference types",
    flag: "reference_types",
    isDefault: true,
  },
  {
    name: "annotations",
    flag: "annotations",
    isDefault: false,
  },
  {
    name: "code metadata",
    flag: "code_metadata",
    isDefault: false,
  },
  {
    name: "gc",
    flag: "gc",
    isDefault: false,
  },
  {
    name: "memory64",
    flag: "memory64",
    isDefault: false,
  },
  {
    name: "multi memory",
    flag: "multi_memory",
    isDefault: false,
  },
  {
    name: "extended_const",
    flag: "extended_const",
    isDefault: false,
  },
  {
    name: "relaxed simd",
    flag: "relaxed_simd",
    isDefault: false,
  },
  {
    name: "custom page sizes",
    flag: "custom_page_sizes",
    isDefault: false,
  },
] as const satisfies Array<FeatureConfigItem>;

export type WasmFeature = (typeof WASM_FEATURES_LIST)[number]["flag"];
export type WasmFeatures = Partial<Record<WasmFeature, boolean>>;
