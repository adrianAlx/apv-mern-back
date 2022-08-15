'use strict';

import { Patient } from '../models/index.js';

export const addPatient = async (req, res) => {
  const { name, email, owner, symptoms, date } = req.body;
  const { authenticatedUser } = req;

  const patient = new Patient({ name, email, owner, symptoms, date });
  patient.veterinary = authenticatedUser.id;

  try {
    patient.save();

    res.status(201).json({ ok: true, msg: 'New patient added!', patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const getPatients = async (req, res) => {
  const { authenticatedUser } = req;

  const [patients, total] = await Promise.all([
    Patient.find().where('veterinary').equals(authenticatedUser),
    Patient.countDocuments().where('veterinary').equals(authenticatedUser),
  ]);

  res.status(200).json({ ok: true, msg: 'Get patients', total, patients });
};

export const getPatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);

  res.status(200).json({ ok: true, msg: 'Get patient', patient });
};

// TODO: Solo el Admin pueda cambiar de Veterinario
export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, owner, email, date, symptoms } = req.body;

  try {
    const patient = await Patient.findByIdAndUpdate(
      id,
      { name, owner, email, date, symptoms },
      { new: true }
    );

    res.status(200).json({ ok: true, msg: 'Updated patient', patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};

export const deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    await Patient.findByIdAndDelete(id);

    res.status(200).json({ ok: true, msg: 'Patient eliminated!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, msg: 'Something went wrong!' });
  }
};
