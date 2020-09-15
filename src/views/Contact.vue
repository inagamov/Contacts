<template>
    <div>
        <preloader/>

        <!-- Background to close any window -->
        <div class="full-window-size-window" v-if="editWindowIsOpened || fieldToRemove || confirmCancellationOfEditingField" @click="editWindowIsOpened != null ? closeEditingFieldWindow() : closeConfirmationWindow()"></div>

        <div class="container">
            <!-- Back to the contacts -->
            <router-link to="/">
                <div title="Back" class="button button_back"><img v-lazyload :data-src="url.back" alt="Back"></div>
            </router-link>

            <!-- Undo the last action -->
            <div class="button button_undo" @click="undoLastAction" title="Undo"><img v-lazyload :data-src="url.undo" alt="Undo"></div>

            <!-- Basic contact info -->
            <div class="contact-header">
                <vue-initials-img :name="contact.name" :title="contact.name" class="contact-header__initials"/>
                <input type="text" v-model="contact.name" @input="updateContactName" class="contact-header__name">
            </div>

            <div class="contact-info">
                <!-- Add additional info -->
                <div class="button button_add-info" @click="addNewField">Add new field</div>

                <!-- Message if user has no additional info fields -->
                <p v-if="!fields[0]" class="text-align-center padding-top-50">You didn't add any additional info yet.</p>

                <!-- Additional info -->
                <div v-for="(field, index) in fields" :key="field.id" class="contact-info__list">
                    <div style="width: 100%">
                        <p class="contact-info__value"><span class="contact-info__value_grey">{{ field.key }}: </span>{{ field.value }}</p>
                    </div>

                    <button class="contact-info__button contact-info__button_edit" @click="openEditWindow(field, index)">Edit</button>
                    <button @click="openConfirmationWindow(field, index)" class="contact-info__button contact-info__button_delete">Delete</button>
                </div>
            </div>

            <!-- Edit field window -->
            <div class="modal" v-if="editWindowIsOpened" @keyup.enter="updateField(backupedField.index)">
                <div class="edit-contact-info">
                    <input type="text" placeholder="Age" class="edit-contact-info__input" v-model="updatedField.key">
                    <input type="text" placeholder="16" class="edit-contact-info__input" v-model="updatedField.value">
                </div>

                <div class="modal__actions">
                    <div class="modal__cancel" @click="confirmCancellationOfEditingField = true; editWindowIsOpened = false;">Cancel</div>
                    <p v-if="updatedField.key == '' || updatedField.value == ''" class="modal__error">Inputs can't be empty.</p>
                    <div class="modal__continue" @click="updateField(backupedField.index)">Save</div>
                </div>
            </div>

            <!-- Confirmation window - cancel editing the field -->
            <div class="modal" v-if="confirmCancellationOfEditingField" @keyup.enter="closeConfirmationWindow(); closeEditingFieldWindow()">
                <p class="message-text">Are you sure you want to cancel the changes?</p>

                <div class="modal__actions">
                    <div class="modal__cancel" @click="confirmCancellationOfEditingField = false; editWindowIsOpened = true;">No</div>
                    <div class="modal__continue" @click="closeConfirmationWindow(); closeEditingFieldWindow()">Yes</div>
                </div>
            </div>

            <!-- Confirmation window - remove field -->
            <div class="modal" v-if="fieldToRemove" @keyup.enter="removeField">
                <p class="message-text">Are you sure you want to remove field <span class="modal__highlighted-text">{{ fieldToRemove.key == '' ? 'empty' : fieldToRemove.key }}</span> with the value of <span class="modal__highlighted-text">{{ fieldToRemove.value == '' ? 'empty' : fieldToRemove.value }}</span>?</p>

                <div class="modal__actions">
                    <div class="modal__cancel" @click="closeConfirmationWindow">Cancel</div>
                    <div class="modal__continue" @click="removeField">Remove</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

// Components
import preloader from '@/components/preloader'

// Contact photo - initials
import VueInitialsImg from 'vue-initials-img'
Vue.use(VueInitialsImg);

// Utils
import lazyload from '@/components/utils/lazyload'

export default {
    name: 'Contacts',
    components: {
        preloader,
    },

    props: {
        preloader: { type: Object, default: () => ({}) }
    },

    data: () => ({
        // Images
        url: {
            add: require('../assets/img/add.png'),
            remove: require('../assets/img/remove.png'),
            back: require('../assets/img/down-arrow.png'),
            undo: require('../assets/img/undo.png'),
        },

        // Related to contact
        contacts: null,
        contact: null,

        // Additional contact info
        fields: [],
        fieldToRemove: null,
        updatedField: {
            key: '',
            value: ''
        },

        // Backup
        backupedField: null,

        // Edit window
        editWindowIsOpened: false,
        confirmCancellationOfEditingField: false,
    }),

    methods: {
        getFields () {
            // Clear previous fields
            this.fields = [];

            // Check for additional info - fields
            if (Object.keys(this.contact).length > 2) {
                // Loop all keys and push them to the fields array
                for (const [key, value] of Object.entries(this.contact)) {
                    // If field key and value are filled
                    if (key != '' && value != '' && key != 'id' && key != 'name') {
                        // Push additional information field
                        this.fields.push({
                            key: key,
                            value: value,
                        });
                    
                    // If key or value (or key and value at the same time) of the field is (are) empty
                    // If key this is the default key (like 'id' or 'name')
                    } else {
                        delete this.contact.key;
                    }
                }
            }
        },

        addNewField () {
            // Create new info about contact
            this.fields.push({
                key: '',
                value: '',
            });
        },

        openConfirmationWindow (field, index) {
            // Set field info to remove
            field.index = index;

            // Open confirmation window
            this.fieldToRemove = field;
        },

        closeConfirmationWindow () {
            // Close confirmation windows
            this.fieldToRemove = null;

            // Open window to confirm the cancellation of editing the field
            this.confirmCancellationOfEditingField = false;
        },

        removeField () {
            // Removing field from the view
            this.fields.splice(this.fieldToRemove.index, 1);

            if (this.contact.hasOwnProperty(this.fieldToRemove.key)) {
                // Removing field locally
                var key = this.fieldToRemove.key;
                delete this.contact[key];

                // Find the contact in a contacts list
                for (var i = 0; i < this.contacts.length; i++) {
                    if (this.contacts[i].id == this.contact.id) {
                        // Replace old contact info with the new one
                        this.contacts[i] = this.contact;

                        // Update the data in local storage
                        localStorage.contacts = JSON.stringify(this.contacts);
                    }
                }
            }

            // Close confirmation window
            this.closeConfirmationWindow();
        },

        openEditWindow (field, index) {
            // Open edit field window
            this.editWindowIsOpened = true;

            // Backup the field
            this.backupedField = field;
            this.backupedField.index = index;

            // Get default field data & repeat it for furute updates
            this.updatedField.key = field.key;
            this.updatedField.value = field.value;
        },

        closeEditingFieldWindow () {
            // Close edit field window
            this.editWindowIsOpened = false;

            // Clear data for updated fields
            this.updatedField = {
                key: '',
                value: ''
            };
        },

        updateField (index) {
            // Find the field
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields.indexOf(this.fields[i]) === index) {
                    // Check for emptiness of the field
                    if (this.updatedField.key != '' && this.updatedField.value != '') {
                        // Check if it's the new field
                        if (this.backupedField.key == '') {
                            // Create the new prop.
                            this.contact[this.updatedField.key] = this.updatedField.value;

                    } else {
                            // The clone (for obj) function
                            const clone = (obj) => Object.assign({}, obj);

                            // Function to swap old key with the new one
                            const renameKey = (object, key, newKey) => {
                                const clonedObj = clone(object);
                                const targetKey = clonedObj[key];

                                delete clonedObj[key];
                                clonedObj[newKey] = targetKey;

                                delete this.contact[this.backupedField.key];

                                return clonedObj;
                            };

                            // Set new key. for the field
                            renameKey(this.contact, this.backupedField.key, this.updatedField.key);

                            // Set new value. for the field
                            this.contact[this.updatedField.key] = this.updatedField.value;
                        }

                        // Find the contact in a contacts list
                        for (var i = 0; i < this.contacts.length; i++) {
                            if (this.contacts[i].id == this.contact.id) {
                                // Replace old contact info with the new one
                                this.contacts[i] = this.contact;

                                // Update the data in local storage
                                localStorage.contacts = JSON.stringify(this.contacts);

                                // Close the edit field window
                                this.closeEditingFieldWindow();
                            }
                        }

                        // Refresh additional info about the contact
                        this.getFields();
                    }
                }
            }
        },

        updateContactName () {
            // Find the contact in a contacts list
            for (var i = 0; i < this.contacts.length; i++) {
                if (this.contacts[i].id == this.contact.id) {
                    if (this.contact.name != '') {
                        // Update the data in local storage
                        localStorage.contacts = JSON.stringify(this.contacts);
                    }
                }
            }
        },
        
        undoLastAction () {
            // Find the field
            for (var i = 0; i < this.fields.length; i++) {
                if (this.fields.indexOf(this.fields[i]) === this.backupedField.index) {
                    // Restore old value for the field
                    this.contact[this.fields[i].key] = this.backupedField.value;

                    // Restore old key for the field
                    if (this.fields[i].key !== this.backupedField.key) {
                        Object.defineProperty(this.contact, this.backupedField.key,
                            Object.getOwnPropertyDescriptor(this.contact, this.fields[i].key));
                        delete this.contact[this.fields[i].key];
                    }

                    // Find the contact in a contacts list
                    for (var i = 0; i < this.contacts.length; i++) {
                        if (this.contacts[i].id == this.contact.id) {
                            // Replace old contact info with the new one
                            this.contacts[i] = this.contact;

                            // Update the data in local storage
                            localStorage.contacts = JSON.stringify(this.contacts);
                        }
                    }

                    // Refresh additional info about the contact
                    this.getFields();
                }
            }
        }
    },

    created () {
        // Load all contacts from the local storage
        if (localStorage.contacts) {
            this.contacts = JSON.parse(localStorage.contacts);
        }

        // Find the contact in a contacts list
        for (var i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].id == this.$route.params.id) {
                // Saving contact info
                this.contact = this.contacts[i];

                // Get additional info about the contact
                this.getFields();

                return;
            }
        }

        // If there is no contact user is looking for 
        this.$router.push('../notFound');
    },

    directives: {
        lazyload
    }
}
</script>

<style scoped>
    @import '../assets/css/styles.css';
</style>