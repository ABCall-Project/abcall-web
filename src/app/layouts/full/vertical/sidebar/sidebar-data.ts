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
        route: '/menu-level',
        children: [
          {
            displayName: 'Crear Incidente',
            iconName: 'point',
            route: '/app/new-issue',
          },
          {
            displayName: 'Asignar Incidente',
            iconName: 'point',
            route: '/app/assign-issue',
          }
        ]
      },
      {
        displayName: 'Tableros de Control',
        iconName: 'point',
        route: '/menu-1',
        children: [
          {
            displayName: 'Tablero de incidentes',
            iconName: 'point',
            route: '/app/dashboard',
          },
          {
            displayName: 'Tablero predictivo',
            iconName: 'point',
            route: '/app/predictive-dashboard',
          },
        ],
      },
    ],
  },
  {
    displayName: 'Administración',
    iconName: 'box-multiple',
    route: '/menu-level',
    children: [
      {
        displayName: 'Cliente',
        iconName: 'point',
        route: '/menu-1',
        children: [
          {
            displayName: 'Consulta de facturación',
            iconName: 'point',
            route: '/app/invoices',
          },


        ],
      },


    ],
  },

];
