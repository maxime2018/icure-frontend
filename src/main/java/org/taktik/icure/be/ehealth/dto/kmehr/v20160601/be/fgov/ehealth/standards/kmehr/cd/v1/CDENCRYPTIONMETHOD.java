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
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, v2.2.8-b130911.1802 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2017.03.09 at 09:24:47 AM CET 
//


package org.taktik.icure.be.ehealth.dto.kmehr.v20160601.be.fgov.ehealth.standards.kmehr.cd.v1;

import java.io.Serializable;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;
import javax.xml.bind.annotation.adapters.CollapsedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;


/**
 * <p>Java class for CD-ENCRYPTION-METHOD complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="CD-ENCRYPTION-METHOD">
 *   &lt;simpleContent>
 *     &lt;extension base="&lt;http://www.ehealth.fgov.be/standards/kmehr/cd/v1>CD-ENCRYPTION-METHODvalues">
 *       &lt;attribute name="S" use="required" type="{http://www.ehealth.fgov.be/standards/kmehr/cd/v1}CD-ENCRYPTION-METHODschemes" />
 *       &lt;attribute name="SV" use="required" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="DN" type="{http://www.w3.org/2001/XMLSchema}string" />
 *       &lt;attribute name="L" type="{http://www.w3.org/2001/XMLSchema}language" default="en" />
 *     &lt;/extension>
 *   &lt;/simpleContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "CD-ENCRYPTION-METHOD", propOrder = {
    "value"
})
public class CDENCRYPTIONMETHOD
    implements Serializable
{

    private final static long serialVersionUID = 20160601L;
    @XmlValue
    protected CDENCRYPTIONMETHODvalues value;
    @XmlAttribute(name = "S", required = true)
    protected CDENCRYPTIONMETHODschemes s;
    @XmlAttribute(name = "SV", required = true)
    protected String sv = "1.0";
    @XmlAttribute(name = "DN")
    protected String dn;
    @XmlAttribute(name = "L")
    @XmlJavaTypeAdapter(CollapsedStringAdapter.class)
    @XmlSchemaType(name = "language")
    protected String l;

    /**
     * Gets the value of the value property.
     * 
     * @return
     *     possible object is
     *     {@link CDENCRYPTIONMETHODvalues }
     *     
     */
    public CDENCRYPTIONMETHODvalues getValue() {
        return value;
    }

    /**
     * Sets the value of the value property.
     * 
     * @param value
     *     allowed object is
     *     {@link CDENCRYPTIONMETHODvalues }
     *     
     */
    public void setValue(CDENCRYPTIONMETHODvalues value) {
        this.value = value;
    }

    /**
     * Gets the value of the s property.
     * 
     * @return
     *     possible object is
     *     {@link CDENCRYPTIONMETHODschemes }
     *     
     */
    public CDENCRYPTIONMETHODschemes getS() {
        return s;
    }

    /**
     * Sets the value of the s property.
     * 
     * @param value
     *     allowed object is
     *     {@link CDENCRYPTIONMETHODschemes }
     *     
     */
    public void setS(CDENCRYPTIONMETHODschemes value) {
        this.s = value;
    }

    /**
     * Gets the value of the sv property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getSV() {
        return sv;
    }

    /**
     * Sets the value of the sv property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setSV(String value) {
        this.sv = value;
    }

    /**
     * Gets the value of the dn property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getDN() {
        return dn;
    }

    /**
     * Sets the value of the dn property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setDN(String value) {
        this.dn = value;
    }

    /**
     * Gets the value of the l property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getL() {
        if (l == null) {
            return "en";
        } else {
            return l;
        }
    }

    /**
     * Sets the value of the l property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setL(String value) {
        this.l = value;
    }

}
