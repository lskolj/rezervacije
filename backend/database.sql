CREATE TABLE korisnici (
  korisnik_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100),
  lozinka VARCHAR(255),
  uloga ENUM('korisnik','administrator') DEFAULT 'korisnik'
);

CREATE TABLE usluge (
  usluga_id INT AUTO_INCREMENT PRIMARY KEY,
  naziv VARCHAR(100),
  opis TEXT,
  trajanje INT,
  cijena DECIMAL(6,2),
  dostupnost BOOLEAN
);

CREATE TABLE termini (
  termin_id INT AUTO_INCREMENT PRIMARY KEY,
  usluga_id INT,
  datum DATE,
  vrijeme TIME,
  dostupan BOOLEAN,
  CONSTRAINT fk_termin_usluga FOREIGN KEY (usluga_id) REFERENCES usluge(usluga_id)
);

CREATE TABLE rezervacije (
  rezervacija_id INT AUTO_INCREMENT PRIMARY KEY,
  korisnik_id INT,
  termin_id INT,
  status ENUM('aktivna','otkazana'),
  datum_rezervacije DATETIME,
  CONSTRAINT fk_rezervacija_korisnik FOREIGN KEY (korisnik_id) REFERENCES korisnici(korisnik_id),
  CONSTRAINT fk_rezervacija_termin FOREIGN KEY (termin_id) REFERENCES termini(termin_id)
);

INSERT INTO korisnici (username, email, lozinka, uloga) VALUES
('admin', 'admin@rezervacije.hr', '$2b$10$4pQfve3YY8v3rsEm5njyoehzjrSeb5jO7Ai0B.HZE8k7w4FXPhwLa', 'administrator'),
('ana', 'ana@gmail.com', '$2b$10$b5v/idoCttlvWVVj7p96M.0HhrxhILT9eEGSy763UQnfjiupTntga', 'korisnik');

INSERT INTO usluge (naziv, opis, trajanje, cijena, dostupnost) VALUES
('Frizerski salon', 'Šišanje i oblikovanje kose', 60, 25.00, TRUE),
('Masaža', 'Opuštajuća masaža cijelog tijela', 90, 45.00, TRUE),
('Automehaničar', 'Servis i dijagnostika vozila', 120, 80.00, TRUE);

INSERT INTO termini (usluga_id, datum, vrijeme, dostupan) VALUES
(1, '2026-08-20', '09:00:00', TRUE),
(1, '2026-08-21', '10:00:00', FALSE),
(2, '2026-08-20', '14:00:00', TRUE),
(3, '2026-08-22', '08:00:00', TRUE);

INSERT INTO rezervacije (korisnik_id, termin_id, status, datum_rezervacije) VALUES
(2, 2, 'aktivna', '2026-08-15 10:00:00');