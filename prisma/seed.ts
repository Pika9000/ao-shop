import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Tạo sản phẩm mẫu
  const products = [
    {
      name: 'Áo Thun Cổ Tròn Basic',
      description: 'Áo thun 100% cotton thoáng mát, thấm hút tốt. Phù hợp mặc đi chơi, đi học.',
      price: 150000,
      imageUrl: 'https://picsum.photos/seed/shirt1/400/500',
      stockQuantity: 100,
    },
    {
      name: 'Áo Polo Thể Thao',
      description: 'Áo polo có cổ, chất liệu polyeste co giãn 4 chiều.',
      price: 250000,
      imageUrl: 'https://picsum.photos/seed/shirt2/400/500',
      stockQuantity: 50,
    },
    {
      name: 'Áo Khoác Hoodie Unisex',
      description: 'Áo khoác nỉ, lót bông ấm áp mùa đông. Form rộng thoải mái.',
      price: 350000,
      imageUrl: 'https://picsum.photos/seed/shirt3/400/500',
      stockQuantity: 30,
    },
    {
      name: 'Áo Sơ Mi Trắng Nam',
      description: 'Áo sơ mi dáng slimfit, vải lụa mềm chống nhăn cao cấp.',
      price: 220000,
      imageUrl: 'https://picsum.photos/seed/shirt4/400/500',
      stockQuantity: 40,
    }
  ]

  console.log('Bắt đầu seed dữ liệu...')
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }
  
  console.log('Seed dữ liệu thành công!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
