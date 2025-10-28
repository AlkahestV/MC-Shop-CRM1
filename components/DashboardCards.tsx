'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const cards = [
  {
    href: '/dashboard/customers',
    title: 'Customer Management',
    description: 'Create new customers, add motorcycle units, and manage customer profiles',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    gradient: 'from-avmoto-blue to-avmoto-blue-dark',
    bg: 'bg-white',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DashboardCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cards.map((card, index) => (
        <motion.div key={index} variants={item}>
          <Link href={card.href}>
            <motion.div
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`${card.bg} rounded-xl shadow-md hover:shadow-xl p-8 border-2 border-gray-100 hover:border-avmoto-blue transition-all cursor-pointer group`}
            >
              <motion.div
                whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.4 }}
                className={`w-16 h-16 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-6 text-white shadow-md`}
              >
                {card.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-avmoto-gray mb-3 group-hover:text-avmoto-blue transition-colors">
                {card.title}
              </h3>
              <p className="text-avmoto-gray-light text-base font-medium leading-relaxed">
                {card.description}
              </p>
              
              {/* Arrow indicator */}
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                whileHover={{ x: 5, opacity: 1 }}
                className="mt-6 text-avmoto-blue font-semibold flex items-center gap-2"
              >
                <span>Get Started</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

