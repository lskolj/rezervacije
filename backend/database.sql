CREATE TABLE korisnici (
  korisnik_id INT AUTO_INCREMENT,
  username VARCHAR(100),
  email VARCHAR(100),
  lozinka VARCHAR(255),
  uloga ENUM('korisnik','administrator') DEFAULT 'korisnik'
);--izrada tablice

ALTER TABLE korisnici --dodavanje primarnog kljuca
ADD PRIMARY KEY (korisnik_id);

CREATE TABLE usluge (
  usluga_id INT AUTO_INCREMENT,
  naziv VARCHAR(100),
  opis TEXT,
  trajanje INT,
  cijena DECIMAL(6,2),
  dostupnost BOOLEAN
);
ALTER TABLE usluge
ADD PRIMARY KEY (usluga_id);

CREATE TABLE termini (
  termin_id INT AUTO_INCREMENT,
  usluga_id INT,
  datum DATE,
  vrijeme TIME,
  dostupan BOOLEAN
);

ALTER TABLE termini
ADD PRIMARY KEY (termin_id);

ALTER TABLE termini --dodavanje stranog kljuca
ADD CONSTRAINT fk_termin_usluga
FOREIGN KEY (usluga_id) REFERENCES usluge(usluga_id);

CREATE TABLE rezervacije (
  rezervacija_id INT AUTO_INCREMENT,
  korisnik_id INT,
  termin_id INT,
  status ENUM('aktivna','otkazana'),
  datum_rezervacije DATETIME
);

ALTER TABLE rezervacije
ADD PRIMARY KEY (rezervacija_id);

ALTER TABLE rezervacije
ADD CONSTRAINT fk_rezervacija_korisnik
FOREIGN KEY (korisnik_id) REFERENCES korisnici(korisnik_id);

ALTER TABLE rezervacije
ADD CONSTRAINT fk_rezervacija_termin
FOREIGN KEY (termin_id) REFERENCES termini(termin_id);
