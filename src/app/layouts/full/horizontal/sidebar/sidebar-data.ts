import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Inicio',
    iconName: 'home',
    route: '/starter',
  },
  // {
  //   displayName: 'Issues',
  //   iconName: 'home',
  //   route: '/app/issues',
  // },
  {
    navCap: 'Other',
  },
  {
    displayName: 'Gestión de Incidentes',
    iconName: 'box-multiple',
    route: '/app',
    children: [
      {
        displayName: 'Incidentes',
        iconName: 'point',
        route: '/app/issues',
      },
      {
        displayName: 'Tableros de Control',
        iconName: 'point',
        route: '/app/dashboard',
      },
    ],
  },
  {
    displayName: 'Menu Level',
    iconName: 'box-multiple',
    route: '/menu-level',
    children: [
      {
        displayName: 'Menu 1',
        iconName: 'point',
        route: '/menu-1',
        children: [
          {
            displayName: 'Menu 1',
            iconName: 'point',
            route: '/menu-1',
          },

          {
            displayName: 'Menu 2',
            iconName: 'point',
            route: '/menu-2',
          },
        ],
      },

      {
        displayName: 'Menu 2',
        iconName: 'point',
        route: '/menu-2',
      },
    ],
  },
  {
    displayName: 'Disabled',
    iconName: 'ban',
    route: '/disabled',
    disabled: true,
  },
];
