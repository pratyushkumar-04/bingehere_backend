import mongoose from "mongoose";

const FOOD_CATEGORIES = ["Popcorn", "Drinks", "Combos", "Snacks", "Desserts"];

const foodImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const nutritionSchema = new mongoose.Schema(
  {
    calories: Number,
    serves: String,
    spiceLevel: {
      type: String,
      enum: ["mild", "medium", "hot"],
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: FOOD_CATEGORIES,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [foodImageSchema],
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one food image is required",
      },
    },

    nutrition: nutritionSchema,

    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
      default: null,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

foodSchema.index({ category: 1, isAvailable: 1 });

export const defaultFoodCatalog = [
  {
    name: "Salted Popcorn",
    slug: "salted-popcorn",
    description: "Classic salted popcorn served fresh for the movie experience.",
    category: "Popcorn",
    price: 250,
    images: [
      {
        url: "/saltedpopcorn.png",
        alt: "Salted popcorn tub",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 420,
      serves: "1 tub",
      spiceLevel: "mild",
      isVeg: true,
    },
    isAvailable: true,
    isFeatured: true,
    tags: ["best seller", "classic"],
  },
  {
    name: "Caramel Popcorn",
    slug: "caramel-popcorn",
    description: "Sweet caramel-coated popcorn with a crunchy finish.",
    category: "Popcorn",
    price: 300,
    images: [
      {
        url: "/caramelpopcorn.png",
        alt: "Caramel popcorn tub",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 470,
      serves: "1 tub",
      spiceLevel: "mild",
      isVeg: true,
    },
    isAvailable: true,
    isFeatured: true,
    tags: ["sweet", "signature"],
  },
  {
    name: "Cheese Popcorn",
    slug: "cheese-popcorn",
    description: "Buttery popcorn tossed with rich cheese seasoning.",
    category: "Popcorn",
    price: 280,
    images: [
      {
        url: "/caramelpopcorn.png",
        alt: "Cheese popcorn tub",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 450,
      serves: "1 tub",
      spiceLevel: "mild",
      isVeg: true,
    },
    isAvailable: true,
    tags: ["cheesy"],
  },
  {
    name: "Coca Cola",
    slug: "coca-cola",
    description: "Chilled soft drink served in a theatre cup.",
    category: "Drinks",
    price: 150,
    images: [
      {
        url: "/pepsi.png",
        alt: "Cold drink cup",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 160,
      serves: "500 ml",
      spiceLevel: "mild",
      isVeg: true,
    },
    isAvailable: true,
    tags: ["cold", "beverage"],
  },
  {
    name: "Iced Tea",
    slug: "iced-tea",
    description: "Refreshing iced tea perfect for a long movie.",
    category: "Drinks",
    price: 180,
    images: [
      {
        url: "/icetea.png",
        alt: "Glass of iced tea",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 110,
      serves: "400 ml",
      spiceLevel: "mild",
      isVeg: true,
    },
    isAvailable: true,
    tags: ["refreshing"],
  },
  {
    name: "Nachos Combo",
    slug: "nachos-combo",
    description: "Crispy nachos with dip and a beverage combo.",
    category: "Combos",
    price: 450,
    images: [
      {
        url: "/nachos.png",
        alt: "Nachos combo tray",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 620,
      serves: "1 combo",
      spiceLevel: "medium",
      isVeg: true,
    },
    isAvailable: true,
    isFeatured: true,
    tags: ["combo", "snack"],
  },
  {
    name: "Burger Combo",
    slug: "burger-combo",
    description: "Burger served with fries and a chilled drink.",
    category: "Combos",
    price: 500,
    images: [
      {
        url: "/burger.png",
        alt: "Burger combo meal",
        isPrimary: true,
      },
    ],
    nutrition: {
      calories: 780,
      serves: "1 combo",
      spiceLevel: "medium",
      isVeg: true,
    },
    isAvailable: true,
    isFeatured: true,
    tags: ["meal", "combo"],
  },
];

export { FOOD_CATEGORIES };

export default mongoose.model("Food", foodSchema);
