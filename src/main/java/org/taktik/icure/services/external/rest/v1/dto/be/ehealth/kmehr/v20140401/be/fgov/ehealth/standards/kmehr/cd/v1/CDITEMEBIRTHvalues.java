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
// Généré le : 2015.03.05 à 11:48:14 AM CET 
//


package org.taktik.icure.services.external.rest.v1.dto.be.ehealth.kmehr.v20140401.be.fgov.ehealth.standards.kmehr.cd.v1;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Classe Java pour CD-ITEM-EBIRTHvalues.
 * 
 * <p>Le fragment de schéma suivant indique le contenu attendu figurant dans cette classe.
 * <p>
 * <pre>
 * &lt;simpleType name="CD-ITEM-EBIRTHvalues">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="multiparity"/>
 *     &lt;enumeration value="samesex"/>
 *     &lt;enumeration value="stillborn"/>
 *     &lt;enumeration value="birthplace"/>
 *     &lt;enumeration value="birthrank"/>
 *     &lt;enumeration value="partusnumber"/>
 *     &lt;enumeration value="beforepregnancyweight"/>
 *     &lt;enumeration value="atdeliveryweight"/>
 *     &lt;enumeration value="height"/>
 *     &lt;enumeration value="previouschildbirth"/>
 *     &lt;enumeration value="previousbornalive"/>
 *     &lt;enumeration value="lastbabybirthdate"/>
 *     &lt;enumeration value="intermediatestillborndelivery"/>
 *     &lt;enumeration value="previouscaesarean"/>
 *     &lt;enumeration value="parity"/>
 *     &lt;enumeration value="pregnancyorigin"/>
 *     &lt;enumeration value="hypertensiondiagnose"/>
 *     &lt;enumeration value="diabetesdiagnose"/>
 *     &lt;enumeration value="HIVdiagnose"/>
 *     &lt;enumeration value="pregnancyduration"/>
 *     &lt;enumeration value="childposition"/>
 *     &lt;enumeration value="inductiondelivery"/>
 *     &lt;enumeration value="epiduralanalgesia"/>
 *     &lt;enumeration value="rachianalagesia"/>
 *     &lt;enumeration value="foetalmonitoring"/>
 *     &lt;enumeration value="streptococcusbcolonization"/>
 *     &lt;enumeration value="intrapartalsbgprophylaxis"/>
 *     &lt;enumeration value="deliveryway"/>
 *     &lt;enumeration value="episiotomy"/>
 *     &lt;enumeration value="caesareanindication"/>
 *     &lt;enumeration value="breastfeeding"/>
 *     &lt;enumeration value="atbirthweight"/>
 *     &lt;enumeration value="apgarscore1"/>
 *     &lt;enumeration value="apgarscore5"/>
 *     &lt;enumeration value="artificialrespiration"/>
 *     &lt;enumeration value="neonataldept"/>
 *     &lt;enumeration value="congenitalmalformation"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "CD-ITEM-EBIRTHvalues")
@XmlEnum
public enum CDITEMEBIRTHvalues {

    @XmlEnumValue("multiparity")
    MULTIPARITY("multiparity"),
    @XmlEnumValue("samesex")
    SAMESEX("samesex"),
    @XmlEnumValue("stillborn")
    STILLBORN("stillborn"),
    @XmlEnumValue("birthplace")
    BIRTHPLACE("birthplace"),
    @XmlEnumValue("birthrank")
    BIRTHRANK("birthrank"),
    @XmlEnumValue("partusnumber")
    PARTUSNUMBER("partusnumber"),
    @XmlEnumValue("beforepregnancyweight")
    BEFOREPREGNANCYWEIGHT("beforepregnancyweight"),
    @XmlEnumValue("atdeliveryweight")
    ATDELIVERYWEIGHT("atdeliveryweight"),
    @XmlEnumValue("height")
    HEIGHT("height"),
    @XmlEnumValue("previouschildbirth")
    PREVIOUSCHILDBIRTH("previouschildbirth"),
    @XmlEnumValue("previousbornalive")
    PREVIOUSBORNALIVE("previousbornalive"),
    @XmlEnumValue("lastbabybirthdate")
    LASTBABYBIRTHDATE("lastbabybirthdate"),
    @XmlEnumValue("intermediatestillborndelivery")
    INTERMEDIATESTILLBORNDELIVERY("intermediatestillborndelivery"),
    @XmlEnumValue("previouscaesarean")
    PREVIOUSCAESAREAN("previouscaesarean"),
    @XmlEnumValue("parity")
    PARITY("parity"),
    @XmlEnumValue("pregnancyorigin")
    PREGNANCYORIGIN("pregnancyorigin"),
    @XmlEnumValue("hypertensiondiagnose")
    HYPERTENSIONDIAGNOSE("hypertensiondiagnose"),
    @XmlEnumValue("diabetesdiagnose")
    DIABETESDIAGNOSE("diabetesdiagnose"),
    @XmlEnumValue("HIVdiagnose")
    HI_VDIAGNOSE("HIVdiagnose"),
    @XmlEnumValue("pregnancyduration")
    PREGNANCYDURATION("pregnancyduration"),
    @XmlEnumValue("childposition")
    CHILDPOSITION("childposition"),
    @XmlEnumValue("inductiondelivery")
    INDUCTIONDELIVERY("inductiondelivery"),
    @XmlEnumValue("epiduralanalgesia")
    EPIDURALANALGESIA("epiduralanalgesia"),
    @XmlEnumValue("rachianalagesia")
    RACHIANALAGESIA("rachianalagesia"),
    @XmlEnumValue("foetalmonitoring")
    FOETALMONITORING("foetalmonitoring"),
    @XmlEnumValue("streptococcusbcolonization")
    STREPTOCOCCUSBCOLONIZATION("streptococcusbcolonization"),
    @XmlEnumValue("intrapartalsbgprophylaxis")
    INTRAPARTALSBGPROPHYLAXIS("intrapartalsbgprophylaxis"),
    @XmlEnumValue("deliveryway")
    DELIVERYWAY("deliveryway"),
    @XmlEnumValue("episiotomy")
    EPISIOTOMY("episiotomy"),
    @XmlEnumValue("caesareanindication")
    CAESAREANINDICATION("caesareanindication"),
    @XmlEnumValue("breastfeeding")
    BREASTFEEDING("breastfeeding"),
    @XmlEnumValue("atbirthweight")
    ATBIRTHWEIGHT("atbirthweight"),
    @XmlEnumValue("apgarscore1")
    APGARSCORE_1("apgarscore1"),
    @XmlEnumValue("apgarscore5")
    APGARSCORE_5("apgarscore5"),
    @XmlEnumValue("artificialrespiration")
    ARTIFICIALRESPIRATION("artificialrespiration"),
    @XmlEnumValue("neonataldept")
    NEONATALDEPT("neonataldept"),
    @XmlEnumValue("congenitalmalformation")
    CONGENITALMALFORMATION("congenitalmalformation");
    private final String value;

    CDITEMEBIRTHvalues(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static CDITEMEBIRTHvalues fromValue(String v) {
        for (CDITEMEBIRTHvalues c: CDITEMEBIRTHvalues.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }

}
