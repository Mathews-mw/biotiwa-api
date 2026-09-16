-- CreateTable
CREATE TABLE "product_shipping_profiles" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "is_shippable" BOOLEAN NOT NULL DEFAULT true,
    "weight_in_grams" INTEGER NOT NULL,
    "width_in_millimeters" INTEGER NOT NULL,
    "height_in_millimeters" INTEGER NOT NULL,
    "length_in_millimeters" INTEGER NOT NULL,
    "insurance_amount" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "product_shipping_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_shipping_profiles_product_id_key" ON "product_shipping_profiles"("product_id");

-- AddForeignKey
ALTER TABLE "product_shipping_profiles" ADD CONSTRAINT "product_shipping_profiles_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
