import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const email = 'alif@renthotel.com'
  const username = 'alif'

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash('alifiscool', 10)

  const hotelType = await prisma.hotelType.create({
    data: {
      name: '5 star',
      description: 'This is a 5 star hotel',
    },
  })

  const roomType = await prisma.room.create({
    data: {
      type: 'Deluxe',
      description: 'This is a deluxe room',
      imageUrl: 'https://www.google.com',

      noOfBaths: 2,
      noOfBeds: 2,
      noOfGuests: 4,

      pricePerNight: 100,
      availableRooms: 3,
    }})

    //Fixing thsse

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      contactInfo: {
        create: {
          phone: '1234567890',
          address: '1234 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94111',
        },
      },
      host: {
        create: {
          bio: 'I am a host',
          hotels: {
            create: {
              name: 'First Hotel',
              typeId: hotelType.id,
              latitude: 37.7749,
              longitude: 122.4194,
              description: 'This is my first hotel',
              imageUrl: 'https://picsum.photos/200',
              socialLink: {
                create: {
                  name: 'facebook',
                  baseUrl: 'https://facebook.com',
                  profileUrl: 'alif.haider.7927',
                },
              },
              facility: {
                create: {
                  name: 'Pool',
                  description: 'This is a pool',
                },
              },
              rooms:{
                create:{
                  type: roomType.id,
              }
            },
          },
        },
      },
    },
  })

  const haider = await prisma.user.create({
    data: {
      email: 'haider@renthotel.dev',
      username: 'haideriscool',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      contactInfo: {
        create: {
          phone: '1234567890',
          address: '1234 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94111',
          country: 'USA',
        },
      },
      admin: {
        create: {},
      },
    },
  })

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
