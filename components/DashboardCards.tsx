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
    bgGradient: 'from-avmoto-blue/10 to-avmoto-blue-dark/10',
  },
  {
    href: '/dashboard/jobs/create',
    title: 'Create Job',
    description: 'Record new service jobs for customer motorcycles',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
  },
  {
    href: '/dashboard/profiles',
    title: 'Customer Profiles',
    description: 'View customer details, motorcycle units, and complete job history',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
  },
  {
    href: '#',
    title: 'Inventory Management',
    description: 'Coming soon...',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    gradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-50 to-gray-100',
    disabled: true,
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
          {card.disabled ? (
            <div className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg p-6 border-2 border-gray-200 opacity-60 cursor-not-allowed`}>
              <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium">
                {card.description}
              </p>
            </div>
          ) : (
            <Link href={card.href}>
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg hover:shadow-2xl p-6 border-2 border-transparent hover:border-avmoto-blue/30 transition-all cursor-pointer group`}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    {card.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-avmoto-gray mb-2 group-hover:text-avmoto-blue transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-avmoto-gray-light text-sm font-medium">
                    {card.description}
                  </p>
                  
                  {/* Arrow indicator */}
                  <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    whileHover={{ x: 5, opacity: 1 }}
                    className="absolute bottom-6 right-6 text-avmoto-blue"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

