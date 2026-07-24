-- =========================================================================
-- SUPRA CONSULTING — Database Schema
-- Run this once against a MySQL server to create the database, tables and
-- starter content:
--
--   mysql -u root -p < backend/db/schema.sql
--
-- The seed data below mirrors the content that used to be hard-coded in the
-- front-end (assets/js/main.js, about.html, testimonials.html, etc.) so the
-- public site looks exactly the same the moment it is wired to the API.
-- =========================================================================

CREATE DATABASE IF NOT EXISTS supra_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE supra_db;

-- -------------------------------------------------------------------------
-- Contacts (enquiry / quote-request form submissions)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(50)  DEFAULT NULL,
  service     VARCHAR(150) DEFAULT NULL,
  message     TEXT         NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Projects (portfolio)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  location    VARCHAR(150) DEFAULT NULL,
  year        VARCHAR(10)  DEFAULT NULL,
  description TEXT         DEFAULT NULL,
  image       VARCHAR(255) DEFAULT NULL,
  status      ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Services
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150) NOT NULL,
  category    VARCHAR(100) DEFAULT NULL,
  description TEXT         DEFAULT NULL,
  image       VARCHAR(255) DEFAULT NULL,
  status      ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Gallery
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  image       VARCHAR(255) NOT NULL,
  caption     VARCHAR(200) DEFAULT NULL,
  status      ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Testimonials
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  company     VARCHAR(150) DEFAULT NULL,
  role        VARCHAR(150) DEFAULT NULL,
  rating      TINYINT      NOT NULL DEFAULT 5,
  quote       TEXT         NOT NULL,
  avatar      VARCHAR(255) DEFAULT NULL,
  status      ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------------------
-- Team
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  role        VARCHAR(150) DEFAULT NULL,
  photo       VARCHAR(255) DEFAULT NULL,
  social_link VARCHAR(255) DEFAULT NULL,
  status      ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================================
-- SEED DATA — matches the content the site already shipped with
-- =========================================================================

INSERT INTO projects (title, category, location, year, description, image, status) VALUES
('Colombo Port City — Marine Boundary Survey','survey','Colombo','2024','High-precision GNSS and hydrographic boundary survey supporting reclamation works across a 269-hectare marine development, delivered to millimetre-level accuracy for title registration.','https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?q=80&w=1200&auto=format&fit=crop','Published'),
('Kandy Highland Bridge — Structural Inspection','inspection','Kandy','2023','Full condition assessment of a 40-year-old highway bridge, including load rating, corrosion mapping and a prioritised rehabilitation plan for the provincial roads authority.','https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop','Published'),
('Galle Fort Heritage Precinct — Engineering Consulting','engineering','Galle','2023','Structural and geotechnical consulting for the sensitive restoration of colonial-era rampart structures within a UNESCO World Heritage precinct.','https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop','Published'),
('Hambantota Logistics Park — Project Management','management','Hambantota','2022','End-to-end project management for a 12-warehouse logistics campus, coordinating 14 subcontractors and delivering three weeks ahead of the client\'s revised schedule.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop','Published'),
('Nuwara Eliya Reservoir — Topographic Survey','survey','Nuwara Eliya','2022','Drone LiDAR and total-station topographic survey of a 90-hectare catchment area for a reservoir capacity study and dam-safety review.','https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop','Published'),
('Colombo Financial Tower — Structural Inspections','inspection','Colombo','2021','Facade and core structural inspection of a 34-storey commercial tower, using rope-access and non-destructive testing methods.','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop','Published'),
('Southern Expressway Extension — Engineering Consulting','engineering','Matara','2021','Independent design review and value-engineering study for a 28km expressway extension, identifying cost savings of over 9% without compromising design life.','https://images.unsplash.com/photo-1545159074-3a2b9e5f9e8a?q=80&w=1200&auto=format&fit=crop','Published'),
('Jaffna Water Treatment Plant — Project Management','management','Jaffna','2020','Programme management of a municipal water treatment upgrade, from procurement through commissioning, serving a population of 210,000.','https://images.unsplash.com/photo-1581091870622-1e6e5c9c9d97?q=80&w=1200&auto=format&fit=crop','Published'),
('Trincomalee Industrial Zone — Topographic & Cadastral Survey','survey','Trincomalee','2020','Combined cadastral and topographic survey of a 150-hectare special economic zone ahead of subdivision and lease allocation.','https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=1200&auto=format&fit=crop','Published');

INSERT INTO services (title, category, description, image, status) VALUES
('Engineering Consulting','Engineering','Structural, civil & geotechnical advisory for every project stage — from feasibility through construction support.','https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop','Published'),
('Survey Services','Survey','Cadastral, topographic & hydrographic surveys, drone LiDAR-enabled, accurate to millimetre tolerances.','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop','Published'),
('Project Management','Management','Programme, procurement and cost control from mobilisation to close-out.','https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop','Published'),
('Structural Inspections','Inspection','Condition assessments and load ratings for ageing or damaged assets using rope-access and NDT.','https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1000&auto=format&fit=crop','Published'),
('Professional Reports','Consulting','Chartered-signed documentation ready for regulators, lenders or courts.','https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=1000&auto=format&fit=crop','Published');

INSERT INTO gallery (image, caption, status) VALUES
('https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=1000&auto=format&fit=crop','Total-station setup on site','Published'),
('https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop','Structural steel review','Published'),
('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop','Drone topographic capture','Published'),
('https://images.unsplash.com/photo-1590674899484-13da0d5e0d1f?q=80&w=1000&auto=format&fit=crop','Site coordination meeting','Published'),
('https://images.unsplash.com/photo-1494522358652-f30e61a60313?q=80&w=1000&auto=format&fit=crop','Foundation inspection','Published'),
('https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=1000&auto=format&fit=crop','As-built drawing review','Published'),
('https://images.unsplash.com/photo-1454165833035-99e04b19d1a9?q=80&w=1000&auto=format&fit=crop','Skyline progress survey','Published'),
('https://images.unsplash.com/photo-1526951521990-620dc14c214b?q=80&w=1000&auto=format&fit=crop','Bridge deck assessment','Published'),
('https://images.unsplash.com/photo-1580893246395-52aead8960dc?q=80&w=1000&auto=format&fit=crop','Field crew briefing','Published'),
('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop','GNSS boundary marking','Published'),
('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1000&auto=format&fit=crop','Rebar and formwork check','Published'),
('https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1000&auto=format&fit=crop','Client project walkthrough','Published');

INSERT INTO testimonials (client_name, company, role, rating, quote, avatar, status) VALUES
('Ranjan Wickramasinghe','Horizon Developers','Director',5,'Supra\'s survey accuracy saved our foundation redesign three weeks of rework. Their reports are the clearest we\'ve received from any consultancy.','https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop','Published'),
('Priyanka Fernando','Ceylon Estates','Asset Manager',5,'The structural inspection team found deterioration our previous consultant missed entirely. Thorough, fast, and genuinely independent.','https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop','Published'),
('Mohamed Rizvi','Southern Logistics Group','COO',5,'They ran project management for our logistics park with real discipline — weekly reporting, honest risk registers, zero drama.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop','Published'),
('Anoma Rathnayake','Skyline Architects','Project Lead',5,'Fixed-fee, on time, and the drone survey data integrated straight into our BIM model. Exactly what a modern consultancy should feel like.','https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop','Published'),
('Suresh Kumar','Trinco Industrial Zone','Site Director',4,'Excellent technical depth on the geotechnical side. Communication could be slightly faster during peak season, but the work itself is outstanding.','https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop','Draft'),
('Chamari Gunasekara','Galle Fort Trust','Heritage Officer',5,'We\'ve used Supra on four separate heritage restoration projects. Their sensitivity to conservation constraints alongside hard engineering is rare.','https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=200&auto=format&fit=crop','Published');

INSERT INTO team (name, role, photo, social_link, status) VALUES
('Eng. Nishantha Perera','Managing Director','https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop','#','Published'),
('Ruwani De Silva','Head of Survey','https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop','#','Published'),
('Eng. Kasun Jayasuriya','Head of Structural Engineering','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop','#','Published'),
('Dilani Abeywickrama','Head of Project Management','https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500&auto=format&fit=crop','#','Published');
