const express = require('express');
var router = express.Router();

var Album = require('../Models/Album.js');
var schemaAlbum = require('../Schemas/Schema-Album.json');


router.get('/Album', (req,res) => {
    Album.all((rows) => {
        res.render('list', {
            title: 'Backoffice Album',
            name: 'Album',
            columns: function () {
                let prettyNames = [];
                let requiredProps = schemaAlbum.required;
                
                Object.entries(schemaAlbum.properties).forEach(prop => {
                    prop.forEach(p => {
                        if(p.prettyName !== undefined && requiredProps.includes(prop[0])){
                            prettyNames.push(p.prettyName);
                        }
                    });
                });
                
                return prettyNames;
            },
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => obj[key]),
                    actions: [{
                        link: './Album/Details/' + obj.id,
                        image:{ src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details'
                        }, {
                        link: './Album/Edit/' + obj.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit'
                        }, {
                        link: '#',
                        image: { src: '../../images/delete.png', alt: 'delete'},
                        tooltip: 'Delete',
                        events: [{
                        name: "onclick",
                        function: "remove",
                        args: obj.id
                        }]
                    }]
                }
            })
        })
    })
});

router.get('/Album/Details/:id', (req,res) => {
    Album.get(req.params.id, function (row){
        res.render('details', {
            properties: function () {
                let allProps = Object.getOwnPropertyNames(row);
                let validProps = [];

                allProps.forEach((prop) => {
                    if(schemaAlbum.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaAlbum.properties[prop]["prettyName"],
                            value: row[prop]
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaAlbum.references) {
                schemaAlbum.references.forEach(function (ref) {
                allRefs.push({
                labelRef: ref.label,
                model: ref.model,
                values: ref.relation === "M-M" ? '/Album/' +
                req.params.id : row[(ref.model + "_id").toLowerCase()]
                     });
                    });
                }
                return allRefs;
                },
                get hasReferences() {
                return this.references().length > 0;
                }

        });
    });
});

router.get('/Album/Insert', (req,res) => {
    
        res.render('insert', {
            labels: function() {
                let allProps = Object.getOwnPropertyNames(new Album());
                let varNames = [];
                allProps.forEach((prop) => {
                    if(schemaAlbum.properties.hasOwnProperty(prop)){
                        varNames.push({
                            name: prop
                        })
                    }
                })
                return varNames;
            },
            title : "Album",
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Album());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };

                
                allProps.forEach((prop) => {
                    if(schemaAlbum.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaAlbum.properties[prop]["prettyName"],
                            correctName: prop,
                            type: types[schemaAlbum.properties[prop].type],
                            required: schemaAlbum.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaAlbum.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaAlbum.properties[prop][c]
                                        })
                                    }
                                })
                                return constra;
                            }
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaAlbum.references) {
                    schemaAlbum.references.forEach(function (ref) {
                        allRefs.push({
                            label: ref.label,
                            model: ref.model,
                            isManyToMany: ref.relation === "M-M"
                        });
                    });
                }
                    return allRefs;
                },
            get hasReferences() {
                return this.references().length > 0;
                }
        });
    
});


router.get('/Album/Edit/:id', (req,res) => {
        Album.get(req.params.id, function (row){
        res.render('edit', {
            
            id: req.params.id,
            labels: function() {
                let allProps = Object.getOwnPropertyNames(new Album());
                let varNames = [];
                allProps.forEach((prop) => {
                    if(schemaAlbum.properties.hasOwnProperty(prop)){
                        varNames.push({
                            name: prop
                        })
                    }
                })
                return varNames;
            },
            title : "Album",
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Album());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };
                
                
                allProps.forEach((prop) => {
                    if(schemaAlbum.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaAlbum.properties[prop]["prettyName"],
                            correctName: prop,
                            type: types[schemaAlbum.properties[prop].type],
                            value: row[prop],
                            required: schemaAlbum.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaAlbum.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaAlbum.properties[prop][c]
                                        })
                                    }
                                })
                                return constra;
                            }
                            
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaAlbum.references) {
                    schemaAlbum.references.forEach(function (ref) {
                        allRefs.push({
                            label: ref.label,
                            model: ref.model,
                            isManyToMany: ref.relation === "M-M"
                        });
                    });
                }
                    return allRefs;
                },
            get hasReferences() {
                return this.references().length > 0;
                }
        });

    });
    
});

module.exports = router;