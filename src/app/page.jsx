import Image from "next/image"
import Link from "next/link"
import prisma from "../lib/prisma"
import { AddToCartButton } from "../components/AddToCartButton"

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h2 className="page-title">Sản phẩm mới nhất</h2>
      
      <div className="product-grid">
        {products.map((product) => {
          const priceFormatted = new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
          }).format(product.price);

          return (
            <Link href={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image-container">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div>Không có ảnh</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-price">{priceFormatted}</div>
                <AddToCartButton product={product} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
