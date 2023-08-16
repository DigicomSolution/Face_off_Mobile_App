import React from 'react';
import {View, StyleSheet, ScrollView, FlatList, Linking} from 'react-native';

import Header from '../Components/Header';
import {RegularText, SemiBoldText} from '../Components/styledTexts';

export default function privacyPolicy({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title="Privacy Policy"
          back={() => navigation.goBack()}
          NoSearch={true}
        />
      </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContainer}
        bounces={false}>
        <RegularText>Your Privacy Rights</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            Mentor & Match is committed to protecting the privacy of our users,
            and strives to provide a safe, secure user experience. This Privacy
            Statement sets forth the online data collection and usage policies
            and practices that apply to this website.
          </RegularText>
          <RegularText style={styles.subDescription}>
            By registering or by using this site, you explicitly accept, without
            limitation or qualification, the collection, use and transfer of the
            personal information provided by you in the manner described in this
            Statement. Please read this Statement carefully as it affects your
            rights and liabilities under law. If you disagree with the way we
            collect and process personal information collected on the website,
            please do not use it.
          </RegularText>
        </View>

        <RegularText>Scope Of This Policy</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            This policy applies to www.mentorandmatch.com and its associated
            community sites. This regulated the processing information relating
            to you and grants you various rights in respect of your personal
            data.
          </RegularText>
          <RegularText style={styles.subDescription}>
            This site contains links to other web sites over which you have no
            control. Mentor & Match is not responsible for the privacy policies
            of other web sites to which you choose to link from this site. We
            encourage you to review the privacy policies of those other websites
            so you can understand how they collect, use, and share your
            information.
          </RegularText>
        </View>

        <RegularText>Information We Collect And Retain</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            You do not have to give us any personal information in order to
            access our webpage. We collect the following general types of
            information about you when you visit our Sites: personal
            information, demographic information, behavioral information, and
            indirect information. Sometimes we collect combinations of these
            types of information. In each case, it is indicated on the web site
            whether any personal or demographic data must be provided to use the
            requested service or not.
          </RegularText>
          <RegularText style={styles.subDescription}>
            Personal information is information that can be used to identify
            you, or any other individual to whom the information may relate,
            personally. We do not collect personal information unless you choose
            to provide it to us.
          </RegularText>
          <RegularText style={styles.subDescription}>
            Some examples of personal information that we collect in some areas
            of our Site, depending on the services you use and local law, are:
          </RegularText>
          <RegularText style={styles.subDescription}>Name</RegularText>
          <RegularText style={styles.subDescription}>Address</RegularText>
          <RegularText style={styles.subDescription}>Email address</RegularText>
          <RegularText style={styles.subDescription}>
            Telephone Number
          </RegularText>
          <RegularText style={styles.subDescription}>
            Contact Information
          </RegularText>
          <RegularText style={styles.subDescription}>
            Information about third parties, such as references or contacts that
            you provide to us if you have their express written consent to do
            so.
          </RegularText>
          <RegularText style={styles.subDescription}>
            Demographic Information is information that is not unique to you in
            the sense that it refers to selected population characteristics,
            such as your zip code or postal code, age, preferences, gender, race
            or ethnicity, occupation, career history, interests and favorites.
          </RegularText>
          <RegularText style={styles.subDescription}>
            In addition Mentor & Match may collect indirect information about
            you when you use certain third party services on our web site.
          </RegularText>
          <RegularText style={styles.subDescription}>
            For example, if you provide a title of ‘Ms.’ we will assume you are
            female. We may personalize the advertising that you are shown on our
            sites or other sites with which we have a business relationship. In
            order to provide this personalization, in addition to information we
            collect about you on our sites, we acquire information (including
            personal, demographic, behavioral and indirect information) about
            you from third parties who provide it to us.
          </RegularText>
        </View>

        <RegularText>How Information Is Used</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            We use the information we gather on the web site for the purposes of
            providing our services, responding to any queries you may have,
            operating and improving the web site, fostering a positive user
            experience and delivering the products and services that we offer.
            Our services may include the display of personalized products,
            content, and advertising relating to your interests and either on
            our site or other sites with which we have a business relationship.
            The information we gathered on any Mentor & Match web site may be
            shared within Mentor & Match on a worldwide basis in order to
            deliver these products and services. By registering with Mentor &
            Match, by managing your profile, or opting in when presented with
            choices,you have consented for us to use your information, subject
            to local law, in the following ways:
          </RegularText>
          <FlatList
            data={informationUsed}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    justifyContent: 'flex-start',
                  }}>
                  <View>
                    <SemiBoldText
                      style={[styles.subDescription, {fontSize: 16}]}>
                      •
                    </SemiBoldText>
                  </View>
                  <View>
                    <SemiBoldText style={styles.subDescription}>
                      {item}
                    </SemiBoldText>
                  </View>
                </View>
              );
            }}
          />
          <RegularText style={styles.subDescription}>
            Some of our products and services enable third parties to see your
            personal information and to contact you. Profile information may be
            used for networking with other community members or may be visible
            to employers who are using the Mentor & Match website. In addition,
            portions of your searchable resume (but not your contact
            information) may be made public in your networking profile.
          </RegularText>
          <RegularText style={styles.subDescription}>
            Information you post in public areas of the site will not be
            accessed, used, and stored by others around the world, including
            those in countries that might not have legislation that guarantees
            adequate protection of personal information as defined by your
            country of residence. By providing your personal information for
            inclusion in our database, you acknowledge that you consent to your
            information being used as described here.
          </RegularText>
          <RegularText style={styles.subDescription}>
            While Mentor & Match takes measures to safeguard your information
            from unauthorized access or inappropriate use by third parties,
            Mentor & Match does not control these third parties and we are not
            responsible for their use of information you post or otherwise make
            available in public areas of Mentor & Match site. Accordingly, you
            should ensure that you do not post sensitive information, including
            personality profiles, to the Mentor & Match site.
          </RegularText>
        </View>

        <RegularText>Disclosure Of Information To Others</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            We may disclose to third parties within your country and abroad your
            personal information, combined personal, demographic, behavioral or
            indirect information, as set forth below:
          </RegularText>
          <RegularText style={styles.subDescription}>
            We may share your information with third parties who help us in the
            delivery of our own products and services to you. We may disclose
            information to companies and individuals we employ to perform
            functions on our behalf. Examples include hosting our web servers,
            analyzing data, providing marketing assistance, processing credit
            card payments, and providing customer service. These companies and
            individuals may be located in a country whose data protection
            legislation is different from your country, and they will have
            access to your personal information as necessary to perform their
            functions, but they may not share that information with any other
            third party or use that data for any other purpose. We will remain
            responsible for any information shared in this way.
          </RegularText>
          <RegularText style={styles.subDescription}>
            We may disclose such information to third parties if you consent to
            such disclosure. If you indicate by configuring your profile that
            you would like to receive information about the opportunities,
            products or services of third parties, we supply your contact
            information to select third parties such as employers, recruiters,
            data aggregators, marketers or others for the purpose of sending you
            e-mail or otherwise communicating with you. We use data we have
            about you (such as the interests and preferences you have expressed)
            to determine whether you might be interested in the opportunities,
            products or services of a particular third party.
          </RegularText>
          <RegularText style={styles.subDescription}>
            We also share aggregated anonymous information about visitors to the
            Sites with Mentor & Match clients, partners, other site visitors,
            and other third parties so that they can understand the kinds of
            visitors to the sites and how those visitors use the sites in order
            to serve advertisements to you on our sites or other sites with
            which we have a business relationship.
          </RegularText>
          <RegularText style={styles.subDescription}>
            We supply technology, hosting and related services to other leading
            companies to power recruitment areas on their web sites. Personal
            and/or demographic information supplied may become a part of Mentor
            & Match database, but it is not accessible by anyone other than you,
            Mentor & Match If you attempt to register with a Mentor & Match
            site, Mentor & Match will recognize your information and you will be
            able to use the information. We disclose information if legally
            required to do so, or at our discretion pursuant to a request from a
            governmental entity or if we believe in good faith – after
            considering your privacy interests and other factors – that such
            action is necessary to:
          </RegularText>
          <RegularText style={styles.subDescription}>
            (a) conform to legal requirements or comply with legal process.
          </RegularText>
          <RegularText style={styles.subDescription}>
            (b) protect our rights or property or our affiliated companies.
          </RegularText>
          <RegularText style={styles.subDescription}>
            (c) prevent a crime or protect national security.
          </RegularText>
          <RegularText style={styles.subDescription}>
            (d) protect the personal safety of users or the public. Mentor &
            Match is a US company and information collected on our Sites is
            stored in whole or in part in the United States, your information
            may become subject to U.S. law.
          </RegularText>
          <RegularText style={styles.subDescription}>
            We may disclose and transfer such information to a third party who
            acquires any or all of Mentor & Match business units, whether such
            acquisition is by way of merger, consolidation or purchase of all or
            a substantial portion of our assets. In addition, in the event
            Mentor & Match becomes the subject of an insolvency proceeding,
            whether voluntary or involuntary, Mentor & Match or its liquidator,
            administrator, receiver or administrative receiver may sell, license
            or otherwise dispose of such information in a transaction approved
            by the court. You will be notified of the sale of all or a
            substantial portion of our business to a third party by email or
            through a prominent notice posted on the sites. Again, in each of
            these situations, the recipients of your data may potentially be
            located in any country in the world. If you are a resident in any EU
            member state, for example, you must be aware that the EU authorities
            do not generally consider that the regulations of non-EU countries
            ensure an adequate or equivalent level of protection as compared to
            the EU data protection regulations. Please remember that if you post
            any of your personal information in public areas of any Mentor &
            Match sites and used by others over whom Mentor & Match has no
            control. We cannot control the use made by third parties of
            information you post or otherwise make available in public areas of
            Mentor & Match.
          </RegularText>
        </View>

        <RegularText>Your Choices About Your Information</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            We retain all the information we gather about you in an effort to
            make your repeat use with us more efficient, practical and elevant
            until you change or remove your personal data as described below.
            Before providing you with a copy of your personal information or
            correcting, updating or deleting such information, we reserve the
            right to verify and authenticate your identity and the personal
            information to which you have requested access. Access to or
            correction, updating or deletion of your personal information may be
            denied or limited by Mentor & Match if it would violate another
            person’s rights and/or as otherwise permitted by applicable law. We
            will respond to information access requests within 45 days of
            receipt. If we require additional time to provide access to your
            information, we will acknowledge receipt of your request within 45
            days and promptly supplement our response within the time period
            required by applicable law. We will respond to information access
            requests within 45 days of receipt. If we require additional time to
            provide access to your information, we will acknowledge receipt of
            your request within 45 days and promptly supplement our response
            within the time period required by applicable law.
          </RegularText>
          <RegularText style={styles.subDescription}>
            If you wish to delete or close your account or account profile
            information altogether, please contact us. An email will be sent to
            you to confirm that your personal information has been deleted (save
            for an archival copy which is not accessible by you or third parties
            on the Internet). The archival copy is retained only for as long as
            Mentor & Match reasonably considers necessary for audit and record
            purposes. We will also retain logs, demographic, indirect, and
            statistical information that may relate to you but do not identify
            you personally. If your personal information was previously accessed
            by others using our Sites, we are not able to delete the information
            or copies thereof from their systems.
          </RegularText>
          <RegularText style={styles.subDescription}>
            Our current expiration and deletion period is 36 months; we may
            extend or reduce this period in order to adjust to changing hiring
            patterns. If we change the period, we will update this notice. You
            will, always receive an email from us before we delete your resume,
            and you always have the ability to delete your resume at any time by
            logging into your account. If you do not want your information to be
            processed as described by this policy, you make revoke your consent
            to our Privacy Policy. If you wish to do so, please contact us.
            However, please note that if you do withdraw your consent, you may
            not be able to use the relevant services and your account and
            profile information will be deleted.
          </RegularText>
        </View>

        <RegularText>Important Information (Security)</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            You are responsible for ensuring that your log-in credentials (your
            username and password) are kept confidential. Mentor & Match has
            implemented technical and organizational measures designed to secure
            your personal information from accidental loss and from unauthorized
            access, use, alteration or disclosure. Notwithstanding such
            measures, the Internet is an open system and we cannot guarantee
            that unauthorized third parties will not be able to defeat those
            measures or use your personal information for improper purposes.
            Moreover, one of our primary purposes is to provide you with a
            platform to broadcast the information in your resume and profile
            widely in order to maximize your academic opportunities. Such an
            environment does present a risk that unauthorized third parties will
            view this data. Further, your resume should not contain any
            sensitive data that you would not want made public. When you place
            an order online with any Mentor & Match your information is
            protected through the use of encryption, such as the Secure Socket
            Layer ("SSL") protocol. SSL makes it difficult for your credit card
            information to be intercepted or stolen while being transmitted.
          </RegularText>
        </View>

        <RegularText>Children</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            Mentor & Match is not intended for, nor do we knowingly collect
            information from, children under the age of 17.
          </RegularText>
        </View>

        <RegularText>Changes To Privacy Statement</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            If we decide to materially change the substance of this Privacy
            Statement, we will, where required, contact you via the email
            address that you maintain in your profile. We will also post those
            changes through a prominent notice on the web site so that you will
            always know what information we gather, how we might use that
            information, and to whom we will disclose it.
          </RegularText>
        </View>

        <RegularText>Legal And Contact Information</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            Your data is submitted to Mentor & Match and is hosted and stored in
            a database on servers situated in the United States owned and
            maintained by Mentor & Match., a California Corporation, whose
            principal place of business is at 2785 Pacific Coast Highway,
            Torrance CA, USA, is the legal entity determining the purposes and
            means of processing the information gathered at the sites and is the
            data controller of all data stored in the Mentor & Match database.
          </RegularText>
          <RegularText style={styles.subDescription}>
            If, at any time, you have questions or concerns about this Privacy
            Statement or believe that we have not adhered to this Privacy
            Statement, please feel free to contact us.
          </RegularText>
        </View>

        <RegularText>Privacy Office</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            Mentor & Match
          </RegularText>
          <RegularText style={styles.subDescription}>
            Privacy Office
          </RegularText>
          <RegularText style={styles.subDescription}>
            2785 Pacific Coast Highway #171
          </RegularText>
          <RegularText style={styles.subDescription}>
            Torrance CA 90505
          </RegularText>
          <RegularText style={styles.subDescription}>
            We will use reasonable efforts to answer promptly your question or
            resolve your problem. If you feel we have not properly addressed
            your question, you may contact TRUSTe.
          </RegularText>
        </View>

        <RegularText>Your California Rights</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            A California resident who has provided personal information to a
            business with whom he/she has established a business relationship
            for personal, family, or household purposes (“California customer”)
            is entitled to request information about whether the business has
            disclosed personal information to any third parties for the third
            parties’ direct marketing purposes.
          </RegularText>
          <RegularText style={styles.subDescription}>
            In general, if the business has made such a disclosure of personal
            information, upon receipt of a request by a California customer, the
            business is required to provide a list of all third parties to whom
            personal information was disclosed in the preceding calendar year,
            as well as a list of the categories of personal information that
            were disclosed.
          </RegularText>
          <RegularText style={styles.subDescription}>
            However, under the law, a business is not required to provide the
            above-described lists if the business adopts and discloses to the
            public (in its privacy policy) a policy of not disclosing customer’s
            personal information to third parties for their direct marketing
            purposes unless the customer first affirmatively agrees to the
            disclosure, as long as the business maintains and discloses this
            policy.
          </RegularText>
          <RegularText style={styles.subDescription}>
            Rather, the business may comply with the law by notifying the
            customer of his or her right to prevent disclosure of personal
            information and providing a cost free means to exercise that right.
          </RegularText>
          <RegularText style={styles.subDescription}>
            As stated in our Privacy Policy, we do not share information with
            third parties for their direct marketing purposes unless you
            affirmatively agree to such disclosure. If you do ask us to share
            your information with a third party for its marketing purposes, we
            will only share information in connection with that specific
            promotion, as we do not share information with any third party on a
            continual basis.
          </RegularText>
          <RegularText style={styles.subDescription}>
            To prevent disclosure of your personal information for use in direct
            marketing by a third party, do not opt in to such use when you
            provide personally identifiable information on one of our sites.
            Please note that whenever you opt in to receive future
            communications from a third party, your information will be subject
            to the third party's privacy policy.
          </RegularText>
          <RegularText style={styles.subDescription}>
            If you later decide that you do not want that third party to use
            your information, you will need to contact the third party directly,
            as we have no control over how third parties use information. You
            should always review the privacy policy of any party that collects
            your information to determine how that entity will handle your
            information.
          </RegularText>
          <RegularText style={styles.subDescription}>
            California customers may request further information about our
            compliance with this law by contacting us. Please note that we are
            only required to respond to one request per customer each year, and
            we are not required to respond to requests made by means other than
            e-mail. Update effective July 2019
          </RegularText>
        </View>

        <RegularText>Promotional Lists And Newsletters</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            ou understand and agree that by using our Website and/or Services,
            your name may be placed on promotional lists to receive emails
            regarding our Website and Services, news from our affiliates, and
            the Mentor & Match newsletter. If at anytime you no longer wish to
            receive such emails, please visit the "Account Settings" section of
            our Website. Mentor & Match complies with all provisions of the
            CAN-SPAM Act.
          </RegularText>
        </View>

        <RegularText>FERPA</RegularText>
        <View style={styles.description}>
          <RegularText style={styles.subDescription}>
            Mentor & Match provides an access point for students (mentees) to
            speak privately with members of college (mentors). Mentor & Match
            takes student information protection very seriously. No one will
            have access to, nor will we disclose any information from, a student
            educational record without the written consent of the student. The
            only exceptions: “school official with legitimate educational
            interests,” to authorized representatives of the federal and state
            governments for audit and evaluation of federal and state supported
            programs, or other provisions outlined by the FERPA document
            <RegularText
              style={{color: '#2a6b9c', textAlign: 'justify'}}
              onPress={() =>
                Linking.openURL(
                  'http://www2.ed.gov/policy/gen/reg/ferpa/index.html',
                )
              }>
              {' '}
              http://www2.ed.gov/policy/gen/reg/ferpa/index.html.
            </RegularText>
          </RegularText>
          <RegularText style={styles.subDescription}>
            Our mentor networking platform is developed with security in mind.
            We encrypt and secure all files hosted. All Mentor & Match server
            certificates are signed by a recognized Certificate authority
            (DigiCert) and we use 256-bit SSL encryption for all web
            communication. All communication amongst the database, application,
            and authentication servers is also conducted via secure connections.
          </RegularText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 3,
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 2,
    padding: 15,
  },
  description: {
    color: '#a9aaac',
    marginVertical: 10,
    textAlign: 'justify',
  },
  subDescription: {
    color: '#a9aaac',
    textAlign: 'justify',
    letterSpacing: 0.2,
  },
});

const informationUsed = [
  'To allow you to create an account.',
  'To create a profile for you based on information that you have provided to us.',
  'To contact you about Site updates, informational and service-related communications, including important security updates.',
  'To provide you additional communications, information, and promotions such as newsletters and career advice.',
  'To inform you of other products or services available from Mentor & Match or its affiliates (“Affiliates” means entities that control, are controlled by or are under common control with Mentor & Match),to enable you to provide feedback, to contact us and for us to respond to you.',
  'To conduct surveys, questionnaires, promotions and contests, and to provide the results thereof such as success stories and contest winners',
  'To provide products and services that enable users to network, post information on bulletin boards, view and compare profiles, and career background and experience.',
  'To generate internal reports about the use of our site.',
  'To provide ‘forward to a friend’ features.',
];
