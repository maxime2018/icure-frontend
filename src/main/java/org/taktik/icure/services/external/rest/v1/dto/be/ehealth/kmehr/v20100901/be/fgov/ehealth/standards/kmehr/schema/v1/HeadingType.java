/*
 * Copyright (C) 2018 Taktik SA
 *
 * This file is part of iCureBackend.
 *
 * iCureBackend is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * iCureBackend is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with iCureBackend.  If not, see <http://www.gnu.org/licenses/>.
 */

//
// Ce fichier a été généré par l'implémentation de référence JavaTM Architecture for XML Binding (JAXB), v2.2.8-b130911.1802 
// Voir <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Toute modification apportée à ce fichier sera perdue lors de la recompilation du schéma source. 
// Généré le : 2015.03.05 à 11:47:56 AM CET 
//


package org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20100901.be.fgov.ehealth.standards.kmehr.schema.v1;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElements;
import javax.xml.bind.annotation.XmlType;
import org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20100901.be.fgov.ehealth.standards.kmehr.cd.v1.CDHEADING;
import org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20100901.be.fgov.ehealth.standards.kmehr.cd.v1.LnkType;
import org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20100901.be.fgov.ehealth.standards.kmehr.dt.v1.TextType;
import org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20100901.be.fgov.ehealth.standards.kmehr.id.v1.IDKMEHR;


/**
 * a heading is used to organise the content of a transaction among chapters or paragraphs.
 * 
 * <p>Classe Java pour headingType complex type.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * 
 * <pre>
 * &lt;complexType name="headingType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="confidentiality" type="{http://www.ehealth.fgov.be/standards/kmehr/schema/v1}confidentialityType" minOccurs="0"/>
 *         &lt;element name="id" type="{http://www.ehealth.fgov.be/standards/kmehr/id/v1}ID-KMEHR" maxOccurs="unbounded"/>
 *         &lt;element name="cd" type="{http://www.ehealth.fgov.be/standards/kmehr/cd/v1}CD-HEADING" maxOccurs="unbounded"/>
 *         &lt;choice maxOccurs="unbounded">
 *           &lt;element name="heading" type="{http://www.ehealth.fgov.be/standards/kmehr/schema/v1}headingType"/>
 *           &lt;element name="item" type="{http://www.ehealth.fgov.be/standards/kmehr/schema/v1}itemType"/>
 *           &lt;element name="text" type="{http://www.ehealth.fgov.be/standards/kmehr/dt/v1}textType"/>
 *           &lt;element name="lnk" type="{http://www.ehealth.fgov.be/standards/kmehr/cd/v1}lnkType"/>
 *         &lt;/choice>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "headingType", propOrder = {
    "confidentiality",
    "ids",
    "cds",
    "headingsAndItemsAndTexts"
})
public class HeadingType implements Serializable
{

    private final static long serialVersionUID = 20100901L;
    protected ConfidentialityType confidentiality;
    @XmlElement(name = "id", required = true)
    protected List<IDKMEHR> ids;
    @XmlElement(name = "cd", required = true)
    protected List<CDHEADING> cds;
    @XmlElements({
        @XmlElement(name = "heading", type = HeadingType.class),
        @XmlElement(name = "item", type = ItemType.class),
        @XmlElement(name = "text", type = TextType.class),
        @XmlElement(name = "lnk", type = LnkType.class)
    })
    protected List<Serializable> headingsAndItemsAndTexts;

    /**
     * Obtient la valeur de la propriété confidentiality.
     * 
     * @return
     *     possible object is
     *     {@link ConfidentialityType }
     *     
     */
    public ConfidentialityType getConfidentiality() {
        return confidentiality;
    }

    /**
     * Définit la valeur de la propriété confidentiality.
     * 
     * @param value
     *     allowed object is
     *     {@link ConfidentialityType }
     *     
     */
    public void setConfidentiality(ConfidentialityType value) {
        this.confidentiality = value;
    }

    /**
     * Gets the value of the ids property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the ids property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getIds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link IDKMEHR }
     * 
     * 
     */
    public List<IDKMEHR> getIds() {
        if (ids == null) {
            ids = new ArrayList<IDKMEHR>();
        }
        return this.ids;
    }

    /**
     * Gets the value of the cds property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the cds property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getCds().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link CDHEADING }
     * 
     * 
     */
    public List<CDHEADING> getCds() {
        if (cds == null) {
            cds = new ArrayList<CDHEADING>();
        }
        return this.cds;
    }

    /**
     * Gets the value of the headingsAndItemsAndTexts property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the headingsAndItemsAndTexts property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getHeadingsAndItemsAndTexts().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link HeadingType }
     * {@link ItemType }
     * {@link TextType }
     * {@link LnkType }
     * 
     * 
     */
    public List<Serializable> getHeadingsAndItemsAndTexts() {
        if (headingsAndItemsAndTexts == null) {
            headingsAndItemsAndTexts = new ArrayList<Serializable>();
        }
        return this.headingsAndItemsAndTexts;
    }

}
