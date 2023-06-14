<template lang="pug">
v-form(ref="formRef")
  .flex.items-center.pb-2
    span.font-extrabold.text-lg Nueva ubicación
  v-row(no-gutters)
    v-col(cols="12", lg="6", md="12", sm="12")
      v-text-field.mx-1.text-slate-600.my-1(
        label="Dirección",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="12", sm="12")
      v-text-field.mx-1.text-slate-600.my-1(
        label="Referencia",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-select.mx-1.text-slate-600.my-1(
        label="Tipo de via",
        :items="['Urbanizacion', 'Avenida', 'Jiron']",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-text-field.mx-1.text-slate-600.my-1(
        label="Calle / Numero",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-text-field.mx-1.text-slate-600.my-1(
        label="Numero de telefono",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-text-field.mx-1.text-slate-600.my-1(
        label="Correo electronico",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-autocomplete.mx-1.text-slate-600.my-1(
        :items="[]",
        label="Distrito",
        variant="outlined",
        density="compact",
        color="primary",
        item-title="distrito",
        item-value="distrito"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-autocomplete.mx-1.text-slate-600.my-1(
        :items="[]",
        label="Provincia",
        variant="outlined",
        density="compact",
        color="primary",
        item-title="provincia",
        item-value="provincia"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-autocomplete.mx-1.text-slate-600.my-1(
        :items="[]",
        label="Departamento",
        variant="outlined",
        density="compact",
        color="primary",
        item-title="departamento",
        item-value="departamento"
      )
  .flex.justify-end.pa-1
    v-btn(color="error", variant="text", :rounded="5")
      span.font-bold.text-xs cancelar
    v-btn.ml-4(color="primary", :rounded="5")
      span.font-bold.text-xs Guardar cambios
</template>
