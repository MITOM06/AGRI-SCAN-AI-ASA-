/** Shop: listing, product detail, cart, checkout, orders. */
export const shop = {
  // Categories (API codes live in apps/web/src/constants/shop.constants.ts)
  categoryAll: "All",
  categoryFertilizer: "Fertiliser",
  categoryPesticide: "Pesticides",
  categorySeed: "Seeds",
  categoryTool: "Tools",
  categoryOther: "Other",

  // Product listing
  storeTitle: "Agri-Shop",
  storeShort: "Shop",
  searchPlaceholder: "Search farming supplies...",
  categoryHeading: "Product categories",
  allProducts: "All products",
  productCount: "{count} products",
  lowStock: "Low stock",
  sold: "{count} sold",
  noProducts: "No products found",
  noProductsHint: "Try a different keyword or category.",

  // Product detail
  notFoundTitle: "Product not found",
  notFoundDesc: "This product may have been removed or never existed.",
  backToStore: "Back to shop",
  inStock: "In stock",
  outOfStock: "Out of stock",
  quantity: "Quantity:",
  stockAvailable: "{count} in stock",
  addedToCart: "Added to cart",
  addToCart: "Add to cart",
  genuineGuarantee: "Authenticity guaranteed",
  genuineGuaranteeDesc: "111% refund if the item is counterfeit",
  nationwideShipping: "Nationwide delivery",
  nationwideShippingDesc: "Shipping support on orders over 500k",
  productDescription: "Product description",
  sellerInfo: "Seller information",
  seller: "Seller",
  trustedSeller: "Trusted seller",
  rating: "Rating",
  products: "Products",
} as const;
