require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('./db');
const { provjeriPrijavu, provjeriAdmina } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend radi!' });
});


// AUTENTIFIKACIJA


app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Sva polja su obavezna.' });
    }

    const [postojeci] = await pool.query(
      'SELECT korisnik_id FROM korisnici WHERE email = ?',
      [email]
    );
    if (postojeci.length > 0) {
      return res.status(409).json({ error: 'Korisnik s tim emailom već postoji.' });
    }

    const hashLozinke = await bcrypt.hash(password, 10);

    const [rezultat] = await pool.query(
      'INSERT INTO korisnici (username, email, lozinka, uloga) VALUES (?, ?, ?, ?)',
      [username, email, hashLozinke, 'korisnik']
    );

    res.status(201).json({ message: 'Registracija uspješna.', korisnik_id: rezultat.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru prilikom registracije.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Unesite korisničko ime i lozinku.' });
    }

    const [redovi] = await pool.query(
      'SELECT * FROM korisnici WHERE username = ?',
      [username]
    );

    if (redovi.length === 0) {
      return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka.' });
    }

    const korisnik = redovi[0];
    const lozinkaOk = await bcrypt.compare(password, korisnik.lozinka);

    if (!lozinkaOk) {
      return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka.' });
    }

    const token = jwt.sign(
      { korisnik_id: korisnik.korisnik_id, username: korisnik.username, uloga: korisnik.uloga },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      korisnik: {
        korisnik_id: korisnik.korisnik_id,
        username: korisnik.username,
        email: korisnik.email,
        uloga: korisnik.uloga,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru prilikom prijave.' });
  }
});


// USLUGE - CRUD


app.get('/api/usluge', async (req, res) => {
  try {
    const [redovi] = await pool.query('SELECT * FROM usluge');
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja usluga.' });
  }
});

app.get('/api/usluge/:id', async (req, res) => {
  try {
    const [redovi] = await pool.query('SELECT * FROM usluge WHERE usluga_id = ?', [req.params.id]);
    if (redovi.length === 0) return res.status(404).json({ error: 'Usluga nije pronađena.' });
    res.json(redovi[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja usluge.' });
  }
});

app.post('/api/usluge', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { naziv, opis, trajanje, cijena, dostupnost } = req.body;
    const [rezultat] = await pool.query(
      'INSERT INTO usluge (naziv, opis, trajanje, cijena, dostupnost) VALUES (?, ?, ?, ?, ?)',
      [naziv, opis, trajanje, cijena, dostupnost]
    );
    res.status(201).json({ usluga_id: rezultat.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom kreiranja usluge.' });
  }
});

app.put('/api/usluge/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { naziv, opis, trajanje, cijena, dostupnost } = req.body;
    await pool.query(
      'UPDATE usluge SET naziv=?, opis=?, trajanje=?, cijena=?, dostupnost=? WHERE usluga_id=?',
      [naziv, opis, trajanje, cijena, dostupnost, req.params.id]
    );
    res.json({ message: 'Usluga ažurirana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom ažuriranja usluge.' });
  }
});

app.delete('/api/usluge/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    await pool.query('DELETE FROM usluge WHERE usluga_id = ?', [req.params.id]);
    res.json({ message: 'Usluga obrisana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom brisanja usluge.' });
  }
});


// TERMINI - CRUD


app.get('/api/termini', async (req, res) => {
  try {
    const { uslugaId } = req.query;
    let sql = `SELECT t.*, u.naziv AS usluga
               FROM termini t
               JOIN usluge u ON t.usluga_id = u.usluga_id`;
    const params = [];

    if (uslugaId) {
      sql += ' WHERE t.usluga_id = ?';
      params.push(uslugaId);
    }

    const [redovi] = await pool.query(sql, params);
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja termina.' });
  }
});

app.post('/api/termini', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { usluga_id, datum, vrijeme, dostupan } = req.body;
    const [rezultat] = await pool.query(
      'INSERT INTO termini (usluga_id, datum, vrijeme, dostupan) VALUES (?, ?, ?, ?)',
      [usluga_id, datum, vrijeme, dostupan]
    );
    res.status(201).json({ termin_id: rezultat.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom kreiranja termina.' });
  }
});

app.put('/api/termini/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const { usluga_id, datum, vrijeme, dostupan } = req.body;
    await pool.query(
      'UPDATE termini SET usluga_id=?, datum=?, vrijeme=?, dostupan=? WHERE termin_id=?',
      [usluga_id, datum, vrijeme, dostupan, req.params.id]
    );
    res.json({ message: 'Termin ažuriran.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom ažuriranja termina.' });
  }
});

app.delete('/api/termini/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    await pool.query('DELETE FROM termini WHERE termin_id = ?', [req.params.id]);
    res.json({ message: 'Termin obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom brisanja termina.' });
  }
});


// REZERVACIJE - CRUD


app.get('/api/rezervacije', provjeriPrijavu, async (req, res) => {
  try {
    const [redovi] = await pool.query(
      `SELECT r.rezervacija_id, r.status, r.datum_rezervacije,
              t.datum, t.vrijeme, u.naziv AS usluga
       FROM rezervacije r
       JOIN termini t ON r.termin_id = t.termin_id
       JOIN usluge u ON t.usluga_id = u.usluga_id
       WHERE r.korisnik_id = ?`,
      [req.user.korisnik_id]
    );
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja rezervacija.' });
  }
});

app.post('/api/rezervacije', provjeriPrijavu, async (req, res) => {
  const konekcija = await pool.getConnection();
  try {
    const { termin_id } = req.body;

    await konekcija.beginTransaction();

    const [termini] = await konekcija.query(
      'SELECT dostupan FROM termini WHERE termin_id = ? FOR UPDATE',
      [termin_id]
    );

    if (termini.length === 0) {
      await konekcija.rollback();
      return res.status(404).json({ error: 'Termin ne postoji.' });
    }
    if (!termini[0].dostupan) {
      await konekcija.rollback();
      return res.status(409).json({ error: 'Termin više nije dostupan.' });
    }

    const [rezultat] = await konekcija.query(
      'INSERT INTO rezervacije (korisnik_id, termin_id, status, datum_rezervacije) VALUES (?, ?, ?, NOW())',
      [req.user.korisnik_id, termin_id, 'aktivna']
    );

    await konekcija.query('UPDATE termini SET dostupan = FALSE WHERE termin_id = ?', [termin_id]);

    await konekcija.commit();
    res.status(201).json({ rezervacija_id: rezultat.insertId, message: 'Termin rezerviran.' });
  } catch (err) {
    await konekcija.rollback();
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom rezervacije.' });
  } finally {
    konekcija.release();
  }
});

app.put('/api/rezervacije/:id/otkazi', provjeriPrijavu, async (req, res) => {
  const konekcija = await pool.getConnection();
  try {
    const [redovi] = await konekcija.query(
      'SELECT * FROM rezervacije WHERE rezervacija_id = ?',
      [req.params.id]
    );

    if (redovi.length === 0) {
      return res.status(404).json({ error: 'Rezervacija ne postoji.' });
    }

    const rezervacija = redovi[0];
    if (rezervacija.korisnik_id !== req.user.korisnik_id && req.user.uloga !== 'administrator') {
      return res.status(403).json({ error: 'Ne možete otkazati tuđu rezervaciju.' });
    }

    await konekcija.beginTransaction();
    await konekcija.query(
      "UPDATE rezervacije SET status = 'otkazana' WHERE rezervacija_id = ?",
      [req.params.id]
    );
    await konekcija.query(
      'UPDATE termini SET dostupan = TRUE WHERE termin_id = ?',
      [rezervacija.termin_id]
    );
    await konekcija.commit();

    res.json({ message: 'Rezervacija otkazana.' });
  } catch (err) {
    await konekcija.rollback();
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom otkazivanja rezervacije.' });
  } finally {
    konekcija.release();
  }
});

app.delete('/api/rezervacije/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    await pool.query('DELETE FROM rezervacije WHERE rezervacija_id = ?', [req.params.id]);
    res.json({ message: 'Rezervacija obrisana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom brisanja rezervacije.' });
  }
});


// KORISNICI - CRUD (samo admin)


app.get('/api/korisnici', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    const [redovi] = await pool.query(
      'SELECT korisnik_id, username, email, uloga FROM korisnici'
    );
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom dohvaćanja korisnika.' });
  }
});

app.delete('/api/korisnici/:id', provjeriPrijavu, provjeriAdmina, async (req, res) => {
  try {
    await pool.query('DELETE FROM korisnici WHERE korisnik_id = ?', [req.params.id]);
    res.json({ message: 'Korisnik obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom brisanja korisnika.' });
  }
});



app.get('/api/statistika/rezervacije-po-usluzi', async (req, res) => {
  try {
    const [redovi] = await pool.query(`
      SELECT u.naziv, COUNT(r.rezervacija_id) AS broj_rezervacija
      FROM usluge u
      LEFT JOIN termini t ON t.usluga_id = u.usluga_id
      LEFT JOIN rezervacije r ON r.termin_id = t.termin_id AND r.status = 'aktivna'
      GROUP BY u.usluga_id, u.naziv
      ORDER BY broj_rezervacija DESC
    `);
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška u upitu.' });
  }
});

app.get('/api/statistika/najaktivniji-korisnici', async (req, res) => {
  try {
    const [redovi] = await pool.query(`
      SELECT k.username, COUNT(r.rezervacija_id) AS broj_aktivnih
      FROM korisnici k
      JOIN rezervacije r ON r.korisnik_id = k.korisnik_id
      WHERE r.status = 'aktivna'
      GROUP BY k.korisnik_id, k.username
      HAVING broj_aktivnih > 0
      ORDER BY broj_aktivnih DESC
    `);
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška u upitu.' });
  }
});

app.get('/api/statistika/dostupni-termini', async (req, res) => {
  try {
    const [redovi] = await pool.query(`
      SELECT t.termin_id, t.datum, t.vrijeme, u.naziv, u.cijena, u.trajanje
      FROM termini t
      JOIN usluge u ON t.usluga_id = u.usluga_id
      WHERE t.dostupan = TRUE AND t.datum >= CURDATE()
      ORDER BY t.datum ASC, t.vrijeme ASC
    `);
    res.json(redovi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška u upitu.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});