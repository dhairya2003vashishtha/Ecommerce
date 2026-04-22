import prisma from '@/lib/prisma'
import { format } from 'date-fns'

import { NotificationClient } from './components/client'
import type { NotificationColumn } from './components/columns'

export default async function NotificationsPage() {
   const notifications = await prisma.notification.findMany({
      where: {},
      include: {
         user: true,
      },
      orderBy: {
         createdAt: 'desc',
      },
   })

   const formattedNotifications: NotificationColumn[] = notifications.map((notification) => ({
      id: notification.id,
      content:
         notification.content.length > 50
            ? notification.content.substring(0, 50) + '...'
            : notification.content,
      isRead: notification.isRead,
      user: notification.user.email,
      createdAt: format(notification.createdAt, 'MMMM do, yyyy'),
   }))

   return <NotificationClient data={formattedNotifications} />
}
