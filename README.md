# 💊 Automated Drug Interaction & Safety Routing Engine

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An enterprise-grade **Clinical Decision Support (CDS) & Pharmacovigilance Routing Engine** designed to detect multi-drug interactions (DDIs), contraindications, and patient allergy conflicts in real time. 

Built with **Python**, **FastAPI**, **PostgreSQL**, and **Redis**, the system computes composite risk scores and uses priority queues to automatically route high-severity alerts to clinical pharmacists and healthcare providers.

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Database Schema & Data Models](#-database-schema--data-models)
- [Safety Scoring & Triage Routing Logic](#-safety-scoring--triage-routing-logic)
- [Performance & Caching Strategy](#-performance--caching-strategy)
- [REST API Endpoints](#-rest-api-endpoints)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Running Tests](#-running-tests)
- [Author](#-author)

---

## 📖 Project Overview

Polypharmacy in clinical workflows often leads to preventable Adverse Drug Events (ADEs). Traditional safety checks frequently overwhelm clinicians with non-critical warnings ("alert fatigue") or suffer high latency when evaluating complex medication regimens against extensive interaction databases.

This project addresses these challenges by providing:
1. **Deterministic Multi-Drug Interaction Graph:** Evaluates pairwise and multi-agent contraindications across medications, patient allergies, hepatic/renal conditions, and food interactions.
2. **Dynamic Severity Scoring & Risk Triage:** Classifies safety risks into four tiers (`CONTRAINDICATED`, `MAJOR`, `MODERATE`, `MINOR`) using dynamic scoring matrices.
3. **Automated Incident Routing:** Dispatches high-severity alerts to designated clinical queues via asynchronous event handlers, webhooks, and priority notification channels.
4. **Sub-Millisecond Lookup Caching:** Leverages Redis key-value hashing for active drug pairing graphs to ensure low latency under high query volume.

---

## ✨ Key Features

- **⚡ Real-Time Multi-Drug Interaction Checking:** Scans active prescriptions against clinical interaction databases and FDA/RxNorm knowledge bases.
- **🚨 Intelligent Alert Routing:** Automatically routes critical warnings (`CONTRAINDICATED` / `MAJOR`) to emergency pharmacist escalation queues while logging non-critical warnings for routine chart review.
- **🧬 Patient Context Awareness:** Evaluates medication safety against patient-specific biomarkers (e.g., eGFR / creatinine clearance for renal dosing, ALT/AST for hepatic risks) and registered allergy lists.
- **🛡️ High-Performance Caching:** Redis caching layer delivers interaction lookups in under 5ms for repeated medication pairings.
- **📊 Comprehensive Audit Trail:** Fully compliant transactional logging storing incoming payloads, computed risk levels, and dispatch timestamps.
- **🧪 Production-Ready Test Suite:** End-to-end unit, integration, and load test coverage using `pytest` and `httpx`.

---

## 🏗️ System Architecture

```text
automated-drug-interaction-safety-routing/
├── app/
│   ├── __init__.py
│   ├── main.py                     # FastAPI app factory, middleware & routing
│   ├── config.py                   # Environment settings & Pydantic config
│   ├── core/
│   │   ├── database.py             # SQLAlchemy Async Engine & connection pool
│   │   ├── redis_client.py         # Redis connection & cache management
│   │   └── security.py             # API Key & JWT token validation
│   ├── models/                     # SQLAlchemy relational entities
│   │   ├── drug.py
│   │   ├── interaction.py
│   │   ├── patient.py
│   │   └── safety_alert.py
│   ├── schemas/                    # Pydantic validation schemas
│   │   ├── prescription_schema.py
│   │   ├── drug_schema.py
│   │   └── alert_schema.py
│   ├── services/                   # Core business & clinical logic
│   │   ├── interaction_engine.py   # Multi-drug graph & pairing scanner
│   │   ├── risk_scorer.py          # Dynamic risk matrix calculator
│   │   ├── triage_router.py        # Queue dispatch & alert routing engine
│   │   └── notification_service.py # Webhook and notification handlers
│   └── api/
│       ├── v1/
│       │   ├── endpoints/
│       │   │   ├── screening.py    # Primary prescription validation endpoint
│       │   │   ├── drugs.py        # Drug registry & lookup endpoints
│       │   │   ├── alerts.py       # Triage queue management & resolution
│       │   │   └── health.py       # Liveness and readiness probes
│       │   └── router.py
├── database/
│   ├── migrations/                 # Alembic migration scripts
│   ├── seeds/
│   │   ├── drugs_seed.sql          # Standard formulary seed data
│   │   └── interactions_seed.sql   # DDI clinical database
│   └── schema.sql                  # Raw PostgreSQL DDL
├── tests/
│   ├── conftest.py                 # Pytest test client & mock DB fixtures
│   ├── test_interaction_engine.py # Edge cases for multi-agent conflicts
│   ├── test_risk_scorer.py         # Scoring validation
│   └── test_screening_api.py       # API integration tests
├── docker-compose.yml              # PostgreSQL, Redis & FastAPI container setup
├── Dockerfile
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
