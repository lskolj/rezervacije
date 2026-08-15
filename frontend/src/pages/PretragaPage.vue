<template>
  <q-page padding>
    <h1>Pretraga</h1>
    <div class="q-gutter-md">
      <q-btn color="primary" label="Pretraži usluge" to="/pretraga_usluga" />
      <q-btn color="primary" label="Pretraži termine" to="/pretraga_termina" />
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PretragaPage'
}
</script>