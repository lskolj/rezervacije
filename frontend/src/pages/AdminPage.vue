<template>
  <q-page padding>
    <div class="q-pa-md row q-gutter-md">
      <div class="q-pa-md">
        <q-card class="my-card">
          <q-table
            title="Usluge"
            :rows="usluge"
            :columns="columns"
            row-key="usluga_id"
            selection="single"
            v-model:selected="selected"
          />
          <q-card-section>
            <q-btn color="negative" @click="obrisiUslugu" label="Obriši odabrano" />
            <q-btn color="primary" @click="ucitajZaIzmjenu" label="Uredi odabrano" class="q-ml-sm" />
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-md">
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ naslovForme }}</div>
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Naziv</q-item-label>
                <q-input square outlined v-model="naziv" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Opis</q-item-label>
                <q-input square outlined v-model="opis" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Trajanje (min)</q-item-label>
                <q-input square outlined type="number" v-model.number="trajanje" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Cijena (€)</q-item-label>
                <q-input square outlined type="number" v-model.number="cijena" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-checkbox v-model="dostupnost" label="Dostupno" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-item>
            <q-btn color="primary" @click="isNova ? kreirajUslugu() : azurirajUslugu()">
              {{ naslovForme }}
            </q-btn>
          </q-item>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { api } from 'boot/axios'

export default {
  setup() {
    const usluge = ref([])
    const selected = ref([])

    const naziv = ref('')
    const opis = ref('')
    const trajanje = ref(0)
    const cijena = ref(0)
    const dostupnost = ref(true)
    const id = ref(0)
    const naslovForme = ref('Nova usluga')
    const isNova = ref(true)

    const columns = [
      { name: 'naziv', align: 'left', label: 'Naziv', field: 'naziv', sortable: true },
      { name: 'cijena', align: 'center', label: 'Cijena', field: 'cijena' },
      { name: 'trajanje', align: 'center', label: 'Trajanje', field: 'trajanje' },
      { name: 'dostupnost', align: 'center', label: 'Dostupno', field: row => row.dostupnost ? 'Da' : 'Ne' }
    ]

    const ucitajUsluge = async () => {
      try {
        const odgovor = await api.get('/usluge')
        usluge.value = odgovor.data
      } catch (err) {
        console.error(err)
      }
    }

    const resetForme = () => {
      naziv.value = ''
      opis.value = ''
      trajanje.value = 0
      cijena.value = 0
      dostupnost.value = true
      id.value = 0
      naslovForme.value = 'Nova usluga'
      isNova.value = true
    }

    const kreirajUslugu = async () => {
      const formData = { naziv: naziv.value, opis: opis.value, trajanje: trajanje.value, cijena: cijena.value, dostupnost: dostupnost.value }
      try {
        await api.post('/usluge', formData)
        await ucitajUsluge()
        resetForme()
      } catch (err) {
        console.error(err)
      }
    }

    const azurirajUslugu = async () => {
      const formData = { naziv: naziv.value, opis: opis.value, trajanje: trajanje.value, cijena: cijena.value, dostupnost: dostupnost.value }
      try {
        await api.put('/usluge/' + id.value, formData)
        await ucitajUsluge()
        resetForme()
      } catch (err) {
        console.error(err)
      }
    }

    const obrisiUslugu = async () => {
      if (selected.value.length === 0) return
      try {
        await api.delete('/usluge/' + selected.value[0].usluga_id)
        await ucitajUsluge()
      } catch (err) {
        console.error(err)
      }
    }

    const ucitajZaIzmjenu = () => {
      if (selected.value.length === 0) return
      const u = selected.value[0]
      id.value = u.usluga_id
      naziv.value = u.naziv
      opis.value = u.opis
      trajanje.value = u.trajanje
      cijena.value = u.cijena
      dostupnost.value = !!u.dostupnost
      naslovForme.value = 'Uredi uslugu'
      isNova.value = false
    }

    ucitajUsluge()

    return {
      usluge, selected, columns,
      naziv, opis, trajanje, cijena, dostupnost,
      naslovForme, isNova,
      kreirajUslugu, azurirajUslugu, obrisiUslugu, ucitajZaIzmjenu
    }
  }
}
</script>