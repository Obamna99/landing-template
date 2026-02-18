import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.review.count()
  if (count > 0) {
    console.log("Reviews already exist, skipping seed.")
    return
  }
  await prisma.review.createMany({
    data: [
      {
        name: "Sarah Cohen",
        role: "Marketing Director",
        company: "TechFlow",
        content:
          "Working with this team transformed our digital presence. Results exceeded expectations.",
        rating: 5,
        result: "+340%",
        result_label: "Traffic Growth",
        active: true,
        display_order: 1,
      },
      {
        name: "David Levi",
        role: "CEO",
        company: "ScaleUp Inc",
        content:
          "Professional, responsive, and truly understand business growth. Highly recommended.",
        rating: 5,
        result: "52",
        result_label: "Monthly Leads",
        active: true,
        display_order: 2,
      },
      {
        name: "Maya Goldberg",
        role: "Founder",
        company: "InnovateCo",
        content:
          "From strategy to execution, they delivered exactly what we needed. Game changer.",
        rating: 5,
        result: "4.2x",
        result_label: "ROI",
        active: true,
        display_order: 3,
      },
    ],
  })
  console.log("Seeded 3 sample reviews.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
