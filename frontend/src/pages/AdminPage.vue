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
          <q-table
            title="Termini"
            :rows="termini"
            :columns="terminColumns"
            row-key="termin_id"
            selection="single"
            v-model:selected="selectedTermin"
          />
          <q-card-section>
            <q-btn color="negative" @click="obrisiTermin" label="Obriši odabrano" />
            <q-btn color="primary" @click="ucitajTerminZaIzmjenu" label="Uredi odabrano" class="q-ml-sm" />
          </q-card-section>
        </q-card>
      </div>

      <div class="q-pa-md">
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ naslovTerminForme }}</div>
          </q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Usluga</q-item-label>
                <q-select
                  square outlined
                  v-model="terminUslugaId"
                  :options="usluge"
                  option-value="usluga_id"
                  option-label="naziv"
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Datum</q-item-label>
                <q-input square outlined type="date" v-model="terminDatum" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Vrijeme</q-item-label>
                <q-input square outlined type="time" v-model="terminVrijeme" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-checkbox v-model="terminDostupan" label="Slobodan" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-item>
            <q-btn color="primary" @click="isNoviTermin ? kreirajTermin() : azurirajTermin()">
              {{ naslovTerminForme }}
            </q-btn>
          </q-item>
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
      <q-btn to="/admin/slozeni-upiti" label="Složeni upiti" color="secondary" class="q-mb-md" />
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

    // ---- Termini ----
    const termini = ref([])
    const selectedTermin = ref([])
    const terminUslugaId = ref(null)
    const terminDatum = ref('')
    const terminVrijeme = ref('')
    const terminDostupan = ref(true)
    const terminId = ref(0)
    const naslovTerminForme = ref('Novi termin')
    const isNoviTermin = ref(true)

    const terminColumns = [
      { name: 'usluga', align: 'left', label: 'Usluga', field: 'usluga', sortable: true },
      { name: 'datum', align: 'center', label: 'Datum', field: 'datum' },
      { name: 'vrijeme', align: 'center', label: 'Vrijeme', field: 'vrijeme' },
      { name: 'dostupan', align: 'center', label: 'Slobodan', field: row => row.dostupan ? 'Da' : 'Ne' }
    ]

    const ucitajTermine = async () => {
      try {
        const odgovor = await api.get('/termini')
        termini.value = odgovor.data
      } catch (err) {
        console.error(err)
      }
    }

    const resetTerminForme = () => {
      terminUslugaId.value = null
      terminDatum.value = ''
      terminVrijeme.value = ''
      terminDostupan.value = true
      terminId.value = 0
      naslovTerminForme.value = 'Novi termin'
      isNoviTermin.value = true
    }

    const kreirajTermin = async () => {
      const formData = {
        usluga_id: terminUslugaId.value,
        datum: terminDatum.value,
        vrijeme: terminVrijeme.value,
        dostupan: terminDostupan.value
      }
      try {
        await api.post('/termini', formData)
        await ucitajTermine()
        resetTerminForme()
      } catch (err) {
        console.error(err)
      }
    }

    const azurirajTermin = async () => {
      const formData = {
        usluga_id: terminUslugaId.value,
        datum: terminDatum.value,
        vrijeme: terminVrijeme.value,
        dostupan: terminDostupan.value
      }
      try {
        await api.put('/termini/' + terminId.value, formData)
        await ucitajTermine()
        resetTerminForme()
      } catch (err) {
        console.error(err)
      }
    }

    const obrisiTermin = async () => {
      if (selectedTermin.value.length === 0) return
      try {
        await api.delete('/termini/' + selectedTermin.value[0].termin_id)
        await ucitajTermine()
      } catch (err) {
        console.error(err)
      }
    }

    const ucitajTerminZaIzmjenu = () => {
      if (selectedTermin.value.length === 0) return
      const t = selectedTermin.value[0]
      terminId.value = t.termin_id
      terminUslugaId.value = t.usluga_id
      terminDatum.value = typeof t.datum === 'string' ? t.datum.split('T')[0] : t.datum
      terminVrijeme.value = t.vrijeme
      terminDostupan.value = !!t.dostupan
      naslovTerminForme.value = 'Uredi termin'
      isNoviTermin.value = false
    }

    ucitajUsluge()
    ucitajTermine()

    return {
      usluge, selected, columns,
      naziv, opis, trajanje, cijena, dostupnost,
      naslovForme, isNova,
      kreirajUslugu, azurirajUslugu, obrisiUslugu, ucitajZaIzmjenu,
      termini, selectedTermin, terminColumns,
      terminUslugaId, terminDatum, terminVrijeme, terminDostupan,
      naslovTerminForme, isNoviTermin,
      kreirajTermin, azurirajTermin, obrisiTermin, ucitajTerminZaIzmjenu
    }
  }
}
</script>