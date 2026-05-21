import React from 'react';
import { ScrollView, View, Text, Linking, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#595959',
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#000',
  },
  subsectionHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#000',
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#595959',
    marginBottom: 12,
  },
  link: {
    color: '#3030F1',
    textDecorationLine: 'underline',
  },
  bulletList: {
    marginLeft: 16,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 14,
    color: '#595959',
    marginBottom: 8,
    lineHeight: 20,
  },
  contactText: {
    fontSize: 14,
    color: '#595959',
    marginBottom: 8,
  },
});

function PrivacyLink({ text, url }: { text: string; url: string }) {
  return (
    <Text
      style={styles.link}
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
    >
      {text}
    </Text>
  );
}

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent} accessible={true} accessibilityLabel="Privacy Policy">
        {/* Header */}
        <Text style={styles.mainTitle}>PRIVACY POLICY</Text>
        <Text style={styles.subtitle}>Last updated March 30, 2026</Text>

        {/* Introduction */}
        <Text style={styles.bodyText}>
          This Privacy Notice for JellyMate ('we', 'us', or 'our') describes how and why we might access, collect, store, use, and/or share ('process') your personal information when you use our services ('Services'), including when you:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            • Download and use our mobile application (JellyMate), or any other application of ours that links to this Privacy Notice
          </Text>
          <Text style={styles.bulletItem}>
            • Engage with us in other related ways, including any marketing or events
          </Text>
        </View>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold' }}>Questions or concerns? </Text>
          Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services.
        </Text>

        <Text style={styles.bodyText}>
          If you still have any questions or concerns, please contact us at{' '}
          <PrivacyLink text="jellymateapp@gmail.com" url="mailto:jellymateapp@gmail.com" />
        </Text>

        {/* Key Points Section */}
        <Text style={styles.sectionHeading}>SUMMARY OF KEY POINTS</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold' }}>
            This summary provides key points from our Privacy Notice
          </Text>
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>What personal information do we process?</Text>
            {'\n'}When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Do we process any sensitive personal information?</Text>
            {'\n'}Some of the information may be considered 'special' or 'sensitive' in certain jurisdictions. We do not process sensitive personal information.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Do we collect any information from third parties?</Text>
            {'\n'}We do not collect any information from third parties.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>How do we process your information?</Text>
            {'\n'}We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>How do we keep your information safe?</Text>
            {'\n'}We have adequate organisational and technical processes and procedures in place to protect your personal information.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>What are your rights?</Text>
            {'\n'}Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
          </Text>
        </View>

        {/* Main Sections */}
        <Text style={styles.sectionHeading}>1. WHAT INFORMATION DO WE COLLECT?</Text>

        <Text style={styles.subsectionHeading}>Personal information you disclose to us</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>We collect personal information that you provide to us.</Text>
        </Text>

        <Text style={styles.bodyText}>
          We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
        </Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold' }}>Personal Information Provided by You.</Text>
          {' '}The personal information that we collect depends on the context of your interactions with us and the Services. The personal information we collect may include:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Locally saved name</Text>
        </View>

        <Text style={styles.subsectionHeading}>Sensitive Information</Text>

        <Text style={styles.bodyText}>
          We do not process sensitive information.
        </Text>

        <Text style={styles.subsectionHeading}>Application Data</Text>

        <Text style={styles.bodyText}>
          If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Mobile Device Access.</Text>
            {' '}We may request access or permission to certain features from your mobile device, including your mobile device's storage, and other features. If you wish to change our access or permissions, you may do so in your device's settings.
          </Text>
        </View>

        <Text style={styles.bodyText}>
          This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.
        </Text>

        {/* Additional Sections */}
        <Text style={styles.sectionHeading}>2. HOW DO WE PROCESS YOUR INFORMATION?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.
          </Text>
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>To request feedback.</Text>
            {' '}We may process your information when necessary to request feedback and to contact you about your use of our Services.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>To identify usage trends.</Text>
            {' '}We may process information about how you use our Services to better understand how they are being used so we can improve them.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>To save or protect an individual's vital interest.</Text>
            {' '}We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.
          </Text>
        </View>

        {/* Legal Bases */}
        <Text style={styles.sectionHeading}>3. WHAT LEGAL BASES DO WE RELY ON?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We only process your personal information when we believe it is necessary and we have a valid legal reason to do so under applicable law.
          </Text>
        </Text>

        <Text style={styles.subsectionHeading}>If you are located in the EU or UK, this section applies to you.</Text>

        <Text style={styles.bodyText}>
          The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information.
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Consent.</Text>
            {' '}We may process your information if you have given us permission to use your personal information for a specific purpose. You can withdraw your consent at any time.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Legitimate Interests.</Text>
            {' '}We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Legal Obligations.</Text>
            {' '}We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency.
          </Text>

          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Vital Interests.</Text>
            {' '}We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party.
          </Text>
        </View>

        {/* Data Sharing */}
        <Text style={styles.sectionHeading}>4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We may share information in specific situations and with specific third parties.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          We may need to share your personal information in the following situations:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>
            <Text style={{ fontWeight: 'bold' }}>Business Transfers.</Text>
            {' '}We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
          </Text>
        </View>

        {/* Third-Party Websites */}
        <Text style={styles.sectionHeading}>5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications.
        </Text>

        {/* Cookies */}
        <Text style={styles.sectionHeading}>6. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We may use cookies and other tracking technologies to collect and store your information.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.
        </Text>

        {/* Data Retention */}
        <Text style={styles.sectionHeading}>7. HOW LONG DO WE KEEP YOUR INFORMATION?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We keep your information for as long as necessary to fulfil the purposes outlined in this Privacy Notice unless otherwise required by law.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law.
        </Text>

        {/* Data Security */}
        <Text style={styles.sectionHeading}>8. HOW DO WE KEEP YOUR INFORMATION SAFE?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We aim to protect your personal information through a system of organisational and technical security measures.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
        </Text>

        {/* Children's Privacy */}
        <Text style={styles.sectionHeading}>9. DO WE COLLECT INFORMATION FROM MINORS?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            We do not knowingly collect data from or market to children under 18 years of age.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.
        </Text>

        <Text style={styles.bodyText}>
          If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at{' '}
          <PrivacyLink text="jellymateapp@gmail.com" url="mailto:jellymateapp@gmail.com" />
        </Text>

        {/* Privacy Rights */}
        <Text style={styles.sectionHeading}>10. WHAT ARE YOUR PRIVACY RIGHTS?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            Depending on your state of residence in the US or in some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          In some regions, you have certain rights under applicable data protection laws. These may include the right to:
        </Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Request access and obtain a copy of your personal information</Text>
          <Text style={styles.bulletItem}>• Request rectification or erasure</Text>
          <Text style={styles.bulletItem}>• Restrict the processing of your personal information</Text>
          <Text style={styles.bulletItem}>• Request data portability</Text>
          <Text style={styles.bulletItem}>• Not be subject to automated decision-making</Text>
        </View>

        <Text style={styles.bodyText}>
          If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority.
        </Text>

        {/* Do-Not-Track */}
        <Text style={styles.sectionHeading}>11. CONTROLS FOR DO-NOT-TRACK FEATURES</Text>

        <Text style={styles.bodyText}>
          Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ('DNT') feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
        </Text>

        {/* US Privacy Rights */}
        <Text style={styles.sectionHeading}>12. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            If you are a resident of California, Colorado, Connecticut, or another state with privacy laws, you may have the right to request access to and receive details about the personal information we maintain about you.
          </Text>
        </Text>

        <Text style={styles.subsectionHeading}>Your Rights</Text>

        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Right to know whether or not we are processing your personal data</Text>
          <Text style={styles.bulletItem}>• Right to access your personal data</Text>
          <Text style={styles.bulletItem}>• Right to correct inaccuracies in your personal data</Text>
          <Text style={styles.bulletItem}>• Right to request the deletion of your personal data</Text>
          <Text style={styles.bulletItem}>• Right to obtain a copy of the personal data you previously shared with us</Text>
          <Text style={styles.bulletItem}>• Right to non-discrimination for exercising your rights</Text>
          <Text style={styles.bulletItem}>• Right to opt out of the processing of your personal data for targeted advertising</Text>
        </View>

        <Text style={styles.subsectionHeading}>How to Exercise Your Rights</Text>

        <Text style={styles.bodyText}>
          To exercise these rights, you can submit a data subject access request by emailing us at{' '}
          <PrivacyLink text="jellymateapp@gmail.com" url="mailto:jellymateapp@gmail.com" />, or by referring to the contact details below.
        </Text>

        {/* Policy Updates */}
        <Text style={styles.sectionHeading}>13. DO WE MAKE UPDATES TO THIS NOTICE?</Text>

        <Text style={styles.bodyText}>
          <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>In Short: </Text>
          <Text style={{ fontStyle: 'italic' }}>
            Yes, we will update this notice as necessary to stay compliant with relevant laws.
          </Text>
        </Text>

        <Text style={styles.bodyText}>
          We may update this Privacy Notice from time to time. The updated version will be indicated by an updated 'Revised' date. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
        </Text>

        {/* Contact Information */}
        <Text style={styles.sectionHeading}>14. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>

        <Text style={styles.bodyText}>
          If you have questions or comments about this notice, you may email us at{' '}
          <PrivacyLink text="jellymateapp@gmail.com" url="mailto:jellymateapp@gmail.com" />
        </Text>

        <Text style={styles.contactText}>
          <Text style={{ fontWeight: 'bold' }}>JellyMate</Text>
        </Text>

        {/* Request/Review Data */}
        <Text style={styles.sectionHeading}>15. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Text>

        <Text style={styles.bodyText}>
          Based on the applicable laws of your country or state of residence, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information.
        </Text>

        <Text style={styles.bodyText}>
          To exercise these rights, please submit a data subject access request by emailing us at{' '}
          <PrivacyLink text="jellymateapp@gmail.com" url="mailto:jellymateapp@gmail.com" />
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
