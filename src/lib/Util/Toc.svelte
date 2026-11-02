<script lang="ts">
  	import { AppState } from '../State/AppState.svelte'
  	import { fade } from 'svelte/transition'
	let { displayPrivacyPolicy, close, } = $props();

</script>

{#if displayPrivacyPolicy}
	<div transition:fade={{duration: 150,}} class="privacypolicyoverlay">
	<button onclick={close}>{AppState.lang == 'fi' ? "Sulje" : "Close"}</button>
		<h2>{AppState.lang == 'fi' ? "DuuniExpo 2026 Tietosuojaseloste" : "DuuniExpo 2026 Privacy Policy"}</h2>
<div>

<p>EU:n yleinen tietosuoja-asetus (2016/679)<br /><br />

Artiklat 13 ja 14<br /><br />

Laatimispäivämäärä: 11.10.2018,<br /><br />

Päivitetty 26.1.2026
</p>
<h3>Henkilötietojen käsittelyn tarkoitus</h3>

<p>DuuniExpo on opiskelijoiden järjestämät rekrytointi- ja verkostoitumismessut. DuuniExpo on LAB-ammattikorkeakoulun oppimisympäristö, jossa opiskelijat oppivat tapahtumamyyntiä, markkinointia, taloudenhallintaa, tiimityöskentelyä, projektin johtamista, turvallisuusnäkökohtien huomiointia, palautteen antamista ja ohjelman rakentamista tapahtumalle.
</p>
<p>Opiskelijat hoitavat tapahtuman myyntiä itsenäisesti, opettajien ohjauksessa. Tapahtumamyyntiä varten kerätään mahdollisista messuille osallistuvista yrityksistä rekisteri, jonka perusteella ollaan yhteydessä yrityksiin ja hoidetaan asiakassuhdetta.
</p>
<h3>Rekisterin tietosisältö</h3>

<p>Yrityksistä kerätään seuraavia tietoja:<br /><br />

· Yrityksen nimi, Y-tunnus ja laskutusosoite sekä muut asiakassuhteeseen ja tilattuihin palveluihin liittyvät tiedot<br /><br />

· Yrityksen yhteyshenkilön nimi, puhelinnumero ja sähköpostiosoite<br /><br />

· Ajankohta, jolloin yritykseen on otettu yhteyttä projektin toimesta ja yritykseltä tiedusteluun saatu vastaus</p>
<h3>Millä perusteella keräämme tietoja</h3>

<p>Henkilötietojen käsittely perustuu rekisterinpitäjän oikeutettuun etuun. Tietoja kerätään Lyyti-palvelun tilauslomakkeen kautta, sähköpostitse ja puhelimitse tapahtuvaa suoramarkkinointia sekä asiakassuhteen ylläpitoa varten.<br /><br />

Koska henkilötietojen käsittely perustuu oikeutettuun etuun, rekisteröidyllä on milloin tahansa oikeus vastustaa tietojensa käsittelyä. Jos yritys / sen yhteyshenkilö vastustaa tietojensa käsittelyä, ei niitä tämän jälkeen voi enää käyttää suoramarkkinointiin.
</p>
<h3>Tietolähteet</h3>

<p>Tietoja kerätään pääosin yrityksen julkisilta internetsivuilta. Lisäksi rekisteriin kerätään tiedot edellisinä vuosina messuilta paikan hankkineista yrityksistä ja heidän yhteyshenkilöistään. Rekisteriin voidaan tallentaa myös tiedot, jotka saadaan asiakkaalta mm. www-lomakkeilla lähetetyistä viesteistä, sähköpostitse, puhelimitse, sosiaalisen median palvelujen kautta, sopimuksista, asiakastapaamisista ja muista tilanteista, joissa asiakas luovuttaa tietojaan.
</p>
<h3>Duuniexpo verkkosivujen kävijäseuranta</h3>

<p>Verkkosivuillamme käytetään avoimen lähdekoodin työkalua Matomo Analytics, jonka avulla analysoimme käyttäjiemme selaamiskäyttäytymistä. Emme kerää henkilökohtaisia tietoja. Matomo käsittelee kävijöiden IP-osoitteita, mutta asennus on tehty niin, että IP-osoitteet anonymisoidaan. Näin varmistetaan, että IP-osoitteet sisällä yksilöiviä henkilötietoja.
</p>

<p>DuuniExpo Passi ei kerää tai käsittele tietoa käyttäjien selauskäyttäytymisestä. DuuniExpo Passi kerää tietoa käyttäjien IP-osoitteista, mutta niitä ei yhdistetä yksilöivään henkilötietoon.
</p>
<h3>Tietojen siirto ja luovuttaminen</h3>

<p>DuuniExpo-organisaatio toimii aina yhden vuoden kerrallaan samojen opiskelijoiden toimesta. Edellisten messujen päätyttyä, opiskelijaryhmä vaihtuu ja tiedot siirretään uusille, Duuniexpon järjestelyistä vastaavien opiskelijoiden käyttöön
</p>
<h3>Tietojen siirto tai luovuttaminen EU:n tai Euroopan talousalueen ulkopuolelle</h3>

<p>Rekisteriä säilytetään Microsoftin Teams ja OneDrive -palveluissa. Microsoft on sitoutunut noudattamaan EU-komission mallisopimuslausekkeita taatessaan riittävän tietosuojatason käsittelemilleen tiedoille: https://privacy.microsoft.com/fi-fi/privacystatement
</p>
<h3>Kerättyjen tietojen turvallinen säilyttäminen</h3>

<p>Rekisterin tiedot eivät ole julkisia. Tietoja käsitellään huolellisesti niin, että henkilön yksityisyyden suoja turvataan. Rekisteriin on pääsy vain Duuniexpo-projektiin kyseisenä vuonna osallistuvia opiskelijoita ja heidän ohjaavilla opettajillaan. Tiedot on suojattu Teams ja OneDrvie –palveluiden käyttöoikeusasetuksin.
</p>
<p>Nettisivun duuniexpo.eu kautta kerättyjä tietoja säilytetään verkkosivuston WordPress sisällönhallintajärjestelmässä, jonne ei ole ulkopuolisilla pääsyä.
</p>
<p>DuuniExpo Passi -sovelluksen kautta kerättyjä tietoja säilytetään palvelimilla, jotka sijaitsevat Suomessa ja joihin ulkopuolisilla ei ole pääsyä.
</p>
<h3>Säilytysajat</h3>

<p>Tiedot säilytetään sen ajan, kun LAB-ammattikorkeakoulu järjestää Duuniexpo projektia.
</p>
<h3>Automatisoitu päätöksenteko</h3>

<p>Aineistoa käsiteltäessä ei tapahdu automaattista päätöksentekoa.
</p>
<h3>Rekisteröidyn oikeudet</h3>

<p>
Rekisteröidyllä on oikeus peruuttaa antamansa suostumus, milloin henkilötietojen käsittely perustuu suostumukseen. Rekisteröidyllä on oikeus tehdä valitus Tietosuojavaltuutetun toimistoon, mikäli rekisteröity katsoo, että häntä koskevien henkilötietojen käsittelyssä on rikottu voimassa olevaa lainsäädäntöä.</p>

<p>Rekisteröidyllä on seuraavat EU: yleisen tietosuoja-asetusten mukaiset oikeudet:<br /><br />

a) Rekisteröidyn oikeus tarkistaa itseään koskevat tiedot (artikla 15)<br /><br />

b) Rekisteröidyn oikeus tietojensa oikaisemiseen (artikla 16)<br /><br />

c) Rekiteröidyn oikeus tietojensa poistamiseen (artikla 17)<br /><br />

d) Rekisteröidyn oikeus tietojensa rajoittamiseen (artikla 18)<br /><br />

e) Rekisretöidyn oikeus siirtää tiedot toiselle rekisterinpitäjälle (artikla 19)<br /><br />

Pyynnöt tulee lähettää kirjallisesti rekisterinpitäjälle. Rekisterinpitäjä voi tarvittaessa pyytää pyynnön esittäjää todistamaan henkilöllisyytensä. Rekisterinpitäjä vastaa asiakkaalle EU: tietosuoja-asetuksessa säädetyssä ajassa (pääsääntöisesti kuukauden kuluessa)</p>

<p>Projektin tiedot<br /><br />

LAB-ammattikorkeakoulu, Duuniexpo-projekti</p>

<p>Rekisterinpitäjä<br /><br />

LAB-ammattikorkeakoulu Oy Mukkulankatu 19, 15210 Lahti Y-tunnus: 2630644-6<br /><br />

Yhteyshenkilön tiedot<br /><br />

Lehtori Tatu Saarinen LAB-ammattikorkeakoulu, Mukkulankatu 19, 15210 Lahti +358 44 708 1832<br /><br />

tatu.saarinen@lab.fi
</p>

<p>LAB-ammattikorkeakoulu Oy:n tietosuojavastaava<br />
Lakimies Ilona Saarenpää<br />
Lappeenrannan-Lahden teknillinen yliopisto LUT<br />
Yliopistonkatu 34, 53850 Lappeenranta<br />
+358 50 4301072<br />
tietosuoja@lut.fi<br />
</p>
</div>
</div>
{/if}

<style>
	.privacypolicyoverlay {
		width: 100%;
		height: 100%;
		z-index: 101;
		position: absolute;
		top:0;
		left:0;
		background: #000000ee;


		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow: hidden;
		overflow-y: auto;
		text-align: center;
	}
	.privacypolicyoverlay h3 {
		text-align: center;
	}
	.privacypolicyoverlay ol li {
		text-align: left;
	}

	.privacypolicyoverlay div {

	}

	.privacypolicyoverlay button {
		position: fixed;
		right: 0.6rem;
		top: 0.6rem;
	}
	.privacypolicyoverlay div {
		width: 90%;
		width: min(90%, 440px);
		text-align: left;
	}
	.privacypolicyoverlay div h3
	{
		text-align: left;
		margin-left:0.5rem;
		color: var(--dnxpYellow);
	}
	.privacypolicyoverlay div p {
		margin-left: 0.5rem;
	}
</style>