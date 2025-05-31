'use strict'

var Contact = require('../models/contacts');

function createContact(req, resp) {
    var contactRequestBody = req.body;
    var newContact = new Contact();

    newContact.userId = contactRequestBody.userId;
    newContact.name = contactRequestBody.name;
    newContact.lastName = contactRequestBody.lastName;
    newContact.landline = contactRequestBody.landline;
    newContact.celular = contactRequestBody.celular;
    newContact.email = contactRequestBody.email;

    if (
        newContact.name === null || newContact.name.trim() === ''
        ||newContact.lastName === null || newContact.lastName.trim() === ''
        || newContact.landline === null || newContact.landline.trim() === ''
        || newContact.celular === null || newContact.celular.trim() === ''
        || newContact.email === null || newContact.email.trim() === ''
    ) {
            resp.status(400).send({'message': 'One or more required variables were not sent'});
    }

    newContact.save().then(
        (savedContact) => {
            resp.status(200).send({'message': 'Contact was created succesfully', 'contact': savedContact});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while creating the contact', 'error': err});
        }
    );
}

function editContact(req,resp){
    var idContact = req.params._id;
    var newContactData = req.body;

    var contact = new Contact();

    contact._id = idContact;
    contact.name = newContactData.name;
    contact.lastName = newContactData.lastName;
    contact.landline = newContactData.landline;
    contact.celular = newContactData.celular;
    contact.email = newContactData.email;

    Contact.findByIdAndUpdate(idContact, newContactData, { new: true }).then(
        updatedContact => {
            resp.status(200).send({ message: 'Contact updated successfully', contact: updatedContact });
        },
        err => {
            resp.status(500).send({ message: 'Error updating the contact', error: err });
        }
    );
}

function findContactByUserId(req, resp) {
    const userId = req.params.userId;

    Contact.find({ userId: userId }).then(
        (contacts) => {
            console.log(contacts)
            resp.status(200).send({'contacts': contacts});
        },
        (err) => {
            resp.status(500).send({'message': 'Error while searching contacts for this user', 'error': err});
        }
    );
}

function deleteContact(req, resp) {
    var contactToDelete = req.params._id;

    Contact.findByIdAndDelete(contactToDelete).then(
        (deletedContact) => {
            resp.status(200).send({'message': 'Contact was deleted succesfully', 'contact': deletedContact});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while deleting the contact', 'error': err});
        }
    );
}

module.exports = {
    createContact, findContactByUserId, deleteContact, editContact
}