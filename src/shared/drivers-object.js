
export const adminOfferTableDriver = {
  showProgress: true,
  nextBtnText: 'Siguiente',
  prevBtnText: 'Anterior',
  doneBtnText: 'Finalizar',
  steps: [
    { element: '#new-offer-btn', popover: { title: 'Nueva Oferta', description: 'Haz clic aquí para crear una nueva oferta.', side: "left", align: 'start' } },
    {
      element: 'tbody tr:first-child td:last-child button:nth-child(1)',
      popover: {
        title: 'Ver Detalles',
        description: 'Haz clic aquí para ver toda la información de la oferta.',
        side: "left", align: 'center'
      }
    },
    {
      element: 'tbody tr:first-child td:last-child button:nth-child(2)',
      popover: {
        title: 'Editar Oferta',
        description: 'Usa este botón para modificar los datos existentes e incluso inhabilita la oferta si lo deseas.',
        side: "left", align: 'center'
      }
    },
    {
      element: 'tbody tr:first-child td:last-child button:nth-child(3)',
      popover: {
        title: 'Configurar Comisiones',
        description: 'Aquí puedes gestionar los valores de comisión.',
        side: "left", align: 'center'
      }
    }
  ]
}