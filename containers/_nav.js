export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Product Management',
    route: '/base',
    icon: 'cil-puzzle',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Products',
        to: '/products',
      },
    ],
  },

  {
    _tag: 'CSidebarNavDropdown',
    name: 'Landing Pages',
    route: '/icons',
    icon: 'cil-star',
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Website Banners',
    route: '/notifications',
    icon: 'cil-bell',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Home Page',
        to: '/home-page',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Category Page',
        to: '/category-page',
      },

    ]
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Discounts',
    route: '/pages',
    icon: 'cil-star',
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Coupons',
    route: '/pages',
    icon: 'cil-star',
  },

]

