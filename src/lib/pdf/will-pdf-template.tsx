import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CompleteWillFormData } from '@/lib/validations/will';

// Define styles matching Indian legal Will format
const styles = StyleSheet.create({
  page: {
    padding: 30, // Reduced padding for better space utilization
    paddingTop: 40,
    paddingBottom: 40,
    fontSize: 12, // Increased font size
    fontFamily: 'Times-Roman',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 16, // Prominent title
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 0,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Times-Italic',
    marginTop: 2,
  },
  section: {
    marginBottom: 10, // Reduced section spacing
    marginTop: 5,
  },
  sectionLabel: {
    fontFamily: 'Times-Bold',
    fontSize: 13,
    marginBottom: 3,
    textDecoration: 'underline',
    backgroundColor: '#f8f9fa', // Subtle background for headers
    padding: 2,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 5, // Tighter paragraph spacing
    fontSize: 12,
  },
  listItem: {
    marginBottom: 3,
    marginLeft: 15, // Reduced indentation
  },
  subListItem: {
    marginLeft: 25, // Tighter nesting
    marginBottom: 2,
  },
  highlight: {
    fontFamily: 'Times-Bold', // Use bold instead of color for black & white printing compatibility/professionalism
  },
  underline: {
    textDecoration: 'underline',
  },
  witnessSection: {
    marginTop: 20,
    marginBottom: 15,
    borderTop: '1 solid #000', // Separation line
    paddingTop: 10,
  },
  signatureBlock: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  signatureBox: {
    width: '45%',
    borderTop: '1 solid #000',
    paddingTop: 5,
  },
  signatureText: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: '0.5 solid #ccc',
    paddingTop: 5,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 20, // Adjusted to sit within page border
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: 10,
    fontFamily: 'Times-Bold',
  },
  pageBorder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 2,
    borderColor: '#000',
    zIndex: -1,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Times-Bold',
    marginBottom: 10,
    marginTop: 10, // Add space before header
  },
  // Cover Page Styles
  coverPage: {
    padding: 15,
    fontFamily: 'Times-Roman',
  },
  coverBorder: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverLogo: {
    fontSize: 50,
    fontFamily: 'Times-Bold',
    marginTop: 40,
    marginBottom: 80,
    textAlign: 'center',
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  coverFooterText: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 8,
    paddingLeft: 40,
    paddingRight: 40,
    lineHeight: 1.4,
  },
  coverBottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    fontSize: 10,
    marginTop: 20,
    paddingBottom: 5,
    fontFamily: 'Times-Bold',
  },
  subSectionHeader: {
    fontSize: 12,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: 'Times-Bold',
    textDecoration: 'underline',
  },
  subSectionContent: {
    marginLeft: 15,
    marginBottom: 5,
  },
});

interface WillPDFTemplateProps {
  data: CompleteWillFormData;
}

interface AssetImage {
  data: string;
  [key: string]: unknown;
}

export const WillPDFDocument: React.FC<WillPDFTemplateProps> = ({ data }) => {
  const { 
    step1, // Testator & Parents
    step2, // Declaration
    step3, // Executors
    step4, // Dispute Resolver
    step5, // Witnesses
    step6, // Beneficiaries
    step7, // Charities
    step8, // Assets
    step9, // Residuary Clause
    step10, // Special Wishes
    step11, // Loan Repayment
    step12, // Organ Donation
  } = data;

  // Helper to resolve recipient name from ID (e.g., "beneficiary-0" -> "John Doe")
  const getRecipientName = (id: string) => {
    if (id.startsWith('beneficiary-')) {
      const index = parseInt(id.split('-')[1]);
      return step6.beneficiaries[index]?.name || id;
    }
    if (id.startsWith('charity-')) {
      const index = parseInt(id.split('-')[1]);
      return step7.charities[index]?.name || id;
    }
    return id;
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverBorder}>
          <View style={{ alignItems: 'center', width: '100%' }}>
            {/* Logo Placeholder */}
            <View style={{ 
              borderWidth: 2, 
              borderColor: '#000', 
              borderRadius: 50, 
              width: 80, 
              height: 80, 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: 40, 
              marginBottom: 80 
            }}>
              <Text style={{ 
                fontSize: 50, 
                fontFamily: 'Times-BoldItalic', 
                marginBottom: 5
              }}>B</Text>
            </View>
            
            <Text style={styles.coverTitle}>Last Will and Testament</Text>
            <Text style={styles.coverSubtitle}>of {step1.fullName}</Text>
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.coverFooterText}>
              This Will has been executed in one continuous sequence, and any addition, removal, or modification of any part shall render it void unless executed with fresh signatures and witness attestation.
            </Text>
            <Text style={styles.coverFooterText} render={({ totalPages }) => (
              `This Will is comprised of ${totalPages} pages including this cover page and the last page.`
            )} />
            
            <View style={styles.coverBottom}>
              <Text style={{ textAlign: 'left', minWidth: 100 }}>{step1.fullName}</Text>
              <Text style={{ textAlign: 'center' }}>Initials: _______</Text>
              <Text style={{ textAlign: 'right', minWidth: 100 }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
          </View>
        </View>
      </Page>

      {/* Main Content Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageBorder} fixed />

        {/* Title */}
        <Text style={styles.title}>Last Will and Testament</Text>
        <Text style={[styles.title, { marginBottom: 20 }]}>Will of {step1.fullName}</Text>

        {/* Section A: Personal and Family Details */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeader}>Section A: Personal and Family Details</Text>
          <Text style={styles.paragraph}>
            I, <Text style={styles.highlight}>{step1.fullName}</Text>, aged <Text style={styles.highlight}>{step1.age} years</Text>
            {step1.aadhaarNumber && <>, having Aadhaar no. <Text style={styles.highlight}>{step1.aadhaarNumber}</Text></>}
            {step1.panNumber && <>, PAN <Text style={styles.highlight}>{step1.panNumber}</Text></>}
            , born on <Text style={styles.highlight}>{step1.dateOfBirth}</Text>
            {step1.nationality && <>, a citizen of <Text style={styles.highlight}>{step1.nationality}</Text></>}
            {step1.religion && <>, religion <Text style={styles.highlight}>{step1.religion}</Text></>}
            , son/daughter of <Text style={styles.highlight}>{step1.fatherName}</Text> and <Text style={styles.highlight}>{step1.motherName}</Text>, a resident of <Text style={styles.highlight}>{step1.residentialAddress.addressLine1}
              {step1.residentialAddress.addressLine2 && `, ${step1.residentialAddress.addressLine2}`}, {' '}
              {step1.residentialAddress.city}, {step1.residentialAddress.state}, {' '}
              {step1.residentialAddress.pinCode}, {step1.residentialAddress.country}
            </Text>, contact number {' '}
            <Text style={styles.highlight}>{step1.contactInfo.mobileNumber}</Text>, email {' '}
            <Text style={styles.highlight}>{step1.contactInfo.emailAddress}</Text>, do hereby make my following Will and Testament which I make and execute at {' '}
            <Text style={styles.highlight}>{step2.signingPlace}</Text> on {' '}
            <Text style={styles.highlight}>{step2.signingDate}</Text>.
          </Text>

          {/* Father Details */}
          {(step1.fatherAadhaar || step1.fatherPan) && (
            <Text style={styles.subListItem}>
              Father Details - Name: <Text style={styles.highlight}>{step1.fatherName}</Text>
              {step1.fatherAadhaar && <>, Aadhaar: <Text style={styles.highlight}>{step1.fatherAadhaar}</Text></>}
              {step1.fatherPan && <>, PAN: <Text style={styles.highlight}>{step1.fatherPan}</Text></>}
            </Text>
          )}

          {/* Mother Details */}
          {(step1.motherAadhaar || step1.motherPan) && (
            <Text style={styles.subListItem}>
              Mother Details - Name: <Text style={styles.highlight}>{step1.motherName}</Text>
              {step1.motherAadhaar && <>, Aadhaar: <Text style={styles.highlight}>{step1.motherAadhaar}</Text></>}
              {step1.motherPan && <>, PAN: <Text style={styles.highlight}>{step1.motherPan}</Text></>}
            </Text>
          )}

          {/* Marital Status and Spouse */}
          <Text style={styles.paragraph}>
            I am <Text style={styles.highlight}>{step1.maritalStatus.toLowerCase()}</Text>.
            {step1.maritalStatus === "Married" && step1.spouseDetails && (
              <> I am married to <Text style={styles.highlight}>{step1.spouseDetails.fullName}</Text>, born on <Text style={styles.highlight}>{step1.spouseDetails.dateOfBirth}</Text>
              {step1.spouseDetails.aadhaarNumber && <>, Aadhaar: <Text style={styles.highlight}>{step1.spouseDetails.aadhaarNumber}</Text></>}
              {step1.spouseDetails.panNumber && <>, PAN: <Text style={styles.highlight}>{step1.spouseDetails.panNumber}</Text></>}.</>
            )}
          </Text>
        </View>

        {/* Section B: Declaration */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeader}>Section B: Declaration of Sound Mind</Text>
          <Text style={styles.paragraph}>
            I hereby declare that I am of sound mind and memory and that this Will is made by me of my own free will and without any coercion, persuasion, or undue influence from any person.
          </Text>
          <Text style={styles.paragraph}>
            I confirm that I have revoked all prior Wills and Codicils made by me at any time.
          </Text>
        </View>

        {/* Section C: Executor Appointment */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeader}>Section C: Executor Appointment</Text>
          <Text style={styles.paragraph}>
            I appoint <Text style={styles.highlight}>{step3.executor}</Text>
            {step3.executorAadhaar && <>, having Aadhaar no. <Text style={styles.highlight}>{step3.executorAadhaar}</Text></>}
            {step3.executorPan && <>, PAN <Text style={styles.highlight}>{step3.executorPan}</Text></>}
            {step3.executorFatherName && <>, son/daughter of Shri. <Text style={styles.highlight}>{step3.executorFatherName}</Text></>}
            {step3.executorRelationship && <>, {step3.executorRelationship}</>}
            {(step3.executorAddress || step3.executorCity) && <>, resident of <Text style={styles.highlight}>
              {[step3.executorAddress, step3.executorCity, step3.executorState, step3.executorCountry, step3.executorPinCode].filter(Boolean).join(', ')}
            </Text></>}
            , as the Executor of this Will.
          </Text>
          {step3.backupExecutor && (
            <Text style={styles.paragraph}>
              In the event that <Text style={styles.highlight}>{step3.executor}</Text> is unable or unwilling to serve, I appoint{' '}
              <Text style={styles.highlight}>{step3.backupExecutor}</Text>
              {step3.backupExecutorAadhaar && <>, having Aadhaar no. <Text style={styles.highlight}>{step3.backupExecutorAadhaar}</Text></>}
              {step3.backupExecutorPan && <>, PAN <Text style={styles.highlight}>{step3.backupExecutorPan}</Text></>}
              {step3.backupExecutorFatherName && <>, son/daughter of Shri. <Text style={styles.highlight}>{step3.backupExecutorFatherName}</Text></>}
              {step3.backupExecutorRelationship && <>, {step3.backupExecutorRelationship}</>}
              {(step3.backupExecutorAddress || step3.backupExecutorCity) && <>, resident of <Text style={styles.highlight}>
                {[step3.backupExecutorAddress, step3.backupExecutorCity, step3.backupExecutorState, step3.backupExecutorCountry, step3.backupExecutorPinCode].filter(Boolean).join(', ')}
              </Text></>}
              , as the alternate Executor.
            </Text>
          )}
          {step3.banyyanFallbackExecutorOptIn && (
            <Text style={styles.paragraph}>
              If both the primary and backup executors are unable or unwilling to execute this Will for any reason, I authorize Banyyan Legacies to step in and execute this Will.
            </Text>
          )}
        </View>

        {/* Section D: Assets and Properties */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Section D: Assets and Properties</Text>
          {step8.assets && step8.assets.length > 0 ? (
            step8.assets.map((asset, index) => (
              <View key={index} style={styles.listItem} wrap={false}>
                <Text style={styles.paragraph}>
                  {index + 1}. <Text style={styles.underline}>{asset.type}</Text>: {
                    Object.entries(asset.details || {})
                      .filter(([key, val]) => key !== 'images' && val !== null && val !== undefined && val !== '')
                      .map(([key, val]) => {
                        // Format key: camelCase to Title Case
                        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return `${formattedKey}: ${val}`;
                      })
                      .join(', ')
                  }
                </Text>
                {asset.selectedRecipients && asset.selectedRecipients.length > 0 && (
                  <Text style={styles.subListItem}>
                    To be distributed to: {asset.selectedRecipients.map(r => `${getRecipientName(r)} (${asset.distribution?.[r]}%)`).join(', ')}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.listItem}>No specific assets declared. All assets shall be distributed as per the residuary clause.</Text>
          )}
        </View>

        {/* Section E: Dispute Resolver */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeader}>Section E: Dispute Resolver</Text>
          {step4.disputeResolver ? (
            <Text style={styles.paragraph}>
              In the event of any disputes regarding the interpretation or implementation of this Will, I appoint <Text style={styles.highlight}>{step4.disputeResolver}</Text>
              {step4.disputeResolverRelation ? <Text>, my <Text style={styles.highlight}>{step4.disputeResolverRelation}</Text></Text> : null}
              {step4.disputeResolverFather ? <Text>, son/daughter of <Text style={styles.highlight}>{step4.disputeResolverFather}</Text></Text> : null}
              {step4.disputeResolverNationality ? <Text>, a national of <Text style={styles.highlight}>{step4.disputeResolverNationality}</Text></Text> : null}
              {step4.disputeResolverAadhaar ? <Text>, holding Aadhaar no. <Text style={styles.highlight}>{step4.disputeResolverAadhaar}</Text></Text> : null}
              {step4.disputeResolverPan ? <Text>, PAN <Text style={styles.highlight}>{step4.disputeResolverPan}</Text></Text> : null}
              {(step4.disputeResolverAddress || step4.disputeResolverCity) ? (
                <Text>, resident of <Text style={styles.highlight}>
                  {[
                    step4.disputeResolverAddress,
                    step4.disputeResolverCity,
                    step4.disputeResolverState,
                    step4.disputeResolverZipCode,
                    step4.disputeResolverCountry
                  ].filter(Boolean).join(', ')}
                </Text></Text>
              ) : null}
              {(step4.disputeResolverPhoneNumber || step4.disputeResolverEmail) ? (
                <Text>, contacted at <Text style={styles.highlight}>
                  {[
                    step4.disputeResolverPhoneNumber ? `${step4.disputeResolverPhoneCountryCode} ${step4.disputeResolverPhoneNumber}` : null,
                    step4.disputeResolverEmail
                  ].filter(Boolean).join(', ')}
                </Text></Text>
              ) : null}
              , as the Dispute Resolver. The decision of the Dispute Resolver shall be final and binding on all parties.
            </Text>
          ) : (
            <Text style={styles.paragraph}>
              In the event of any dispute or difference of opinion regarding the interpretation of this Will or the administration of my estate, I direct that such dispute shall be resolved amicably among the beneficiaries. If an amicable resolution is not reached, the decision of my Executor(s) shall be final and binding.
            </Text>
          )}
        </View>

        {/* Section F: Beneficiaries and Distribution */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeader}>Section F: Beneficiaries</Text>
          <Text style={styles.paragraph}>
            I bequeath my assets as specified in the distribution section to the following beneficiaries:
          </Text>
          {step6.beneficiaries.map((beneficiary, index) => (
            <View key={index} style={styles.listItem} wrap={false}>
              <Text style={styles.paragraph}>
                {index + 1}. <Text style={styles.highlight}>{beneficiary.name}</Text>
                {beneficiary.relation && <>, ({beneficiary.relation})</>}
                {beneficiary.dateOfBirth && <>, DOB: <Text style={styles.highlight}>{beneficiary.dateOfBirth}</Text></>}
                {beneficiary.aadhaar && <>, Aadhaar: <Text style={styles.highlight}>{beneficiary.aadhaar}</Text></>}
                {beneficiary.pan && <>, PAN: <Text style={styles.highlight}>{beneficiary.pan}</Text></>}
              </Text>
              {beneficiary.guardianName && (
                <Text style={styles.subListItem}>
                  Guardian for Minor - Name: <Text style={styles.highlight}>{beneficiary.guardianName}</Text>
                  {beneficiary.guardianRelation && <>, Relation: {beneficiary.guardianRelation}</>}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Section G: Residuary Clause */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionHeader}>Section G: Residuary Clause</Text>
          <Text style={styles.paragraph}>
            Any assets or properties not specifically mentioned above, whether now owned or hereafter acquired, shall be distributed among the following residuary beneficiaries:
          </Text>
          {step9.selectedRecipients && step9.selectedRecipients.length > 0 ? (
            step9.selectedRecipients.map((recipient, idx) => (
              <Text key={idx} style={styles.listItem}>
                - <Text style={styles.highlight}>{getRecipientName(recipient)}</Text>: {step9.distribution?.[recipient] || 0}%
              </Text>
            ))
          ) : (
            <Text style={styles.paragraph}>No specific residuary distribution specified.</Text>
          )}
        </View>

        {/* Section H: Additional Provisions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Section H: Additional Provisions</Text>
          
          {/* Charities */}
          {step7.charities && step7.charities.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.subSectionHeader}>Charitable Donations</Text>
              {step7.charities.map((charity, index) => (
                <View key={index} style={styles.subSectionContent}>
                  <Text style={styles.paragraph}>
                    {index + 1}. <Text style={styles.highlight}>{charity.name}</Text>
                    {charity.identificationNumber && <>, ID: {charity.identificationNumber}</>}
                    {charity.address && <>, Address: {charity.address}</>}
                    {(charity.city || charity.state || charity.country) && <>, {[charity.city, charity.state, charity.country, charity.zipCode].filter(Boolean).join(', ')}</>}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Funeral Wishes */}
          {step10.funeralWish && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.subSectionHeader}>Funeral Instructions</Text>
              <Text style={[styles.paragraph, styles.subSectionContent]}>{step10.funeralWish}</Text>
            </View>
          )}

          {/* Messages */}
          {step10.messages && step10.messages.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.subSectionHeader}>Messages to Family</Text>
              {step10.messages.map((msg, idx) => (
                <View key={idx} style={styles.subSectionContent}>
                  <Text style={styles.paragraph}>
                    To <Text style={styles.highlight}>{msg.name}</Text>
                    {msg.relation && <> ({msg.relation})</>}: &quot;{msg.message}&quot;
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Other Arrangements */}
          {step10.otherArrangements && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.subSectionHeader}>Other Instructions</Text>
              <Text style={[styles.paragraph, styles.subSectionContent]}>{step10.otherArrangements}</Text>
            </View>
          )}

          {/* Loan Repayments */}
          {step11.accounts && step11.accounts.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.subSectionHeader}>Loan Repayments</Text>
              {step11.accounts.map((acc, idx) => (
                <View key={idx} style={styles.subSectionContent}>
                  <Text style={styles.paragraph}>
                    - {acc.bankName} ({acc.accountType}) A/c: {acc.accountNumber}
                    {acc.fromAssets && " (To be paid from assets)"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Organ Donation */}
          {step12.donationChoice !== 'none' && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.subSectionHeader}>Organ Donation Wishes</Text>
              <Text style={[styles.paragraph, styles.subSectionContent]}>
                  I hereby express my wish to donate the following for therapeutic, medical, or research purposes:
              </Text>
              <View style={{ marginLeft: 30, marginTop: 5 }}>
                 {step12.donationChoice === 'all' && <Text style={styles.paragraph}>• Any needed organs and tissues.</Text>}
                 {step12.donationChoice === 'specific' && (
                  <>
                    {step12.selectedOrgans && step12.selectedOrgans.length > 0 && (
                      <Text style={styles.paragraph}>• Specific Organs: {step12.selectedOrgans.join(', ')}</Text>
                    )}
                    {step12.selectedTissues && step12.selectedTissues.length > 0 && (
                      <Text style={styles.paragraph}>• Specific Tissues: {step12.selectedTissues.join(', ')}</Text>
                    )}
                  </>
                 )}
              </View>
            </View>
          )}
        </View>

        {/* Witnesses Section */}
        <View style={styles.witnessSection} wrap={false}>
          <Text style={styles.sectionHeader}>Attestation by Witnesses</Text>
          <Text style={styles.paragraph}>
            We hereby attest that this Will has been signed by <Text style={styles.highlight}>{step1.fullName}</Text> in our presence, and we have signed as witnesses in {step1.gender === 'Female' ? 'her' : 'his'} presence and in the presence of each other.
          </Text>
        </View>

        {/* Signature Blocks */}
        <View style={styles.signatureBlock} wrap={false}>
          <View style={styles.signatureBox}>
            <Text style={styles.sectionLabel}>Witness 1</Text>
            {step5.witness1 && (
              <>
                <Text style={styles.signatureText}>Name: <Text style={styles.highlight}>{step5.witness1.name}</Text></Text>
                {step5.witness1.aadhaar && <Text style={styles.signatureText}>Aadhaar: <Text style={styles.highlight}>{step5.witness1.aadhaar}</Text></Text>}
                <Text style={styles.signatureText}>Father: <Text style={styles.highlight}>{step5.witness1.father}</Text></Text>
                <Text style={styles.signatureText}>Address: <Text style={styles.highlight}>
                  {[step5.witness1.address, step5.witness1.city, step5.witness1.state, step5.witness1.zipCode].filter(Boolean).join(', ')}
                </Text></Text>
              </>
            )}
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.sectionLabel}>Witness 2</Text>
            {step5.witness2 && (
              <>
                <Text style={styles.signatureText}>Name: <Text style={styles.highlight}>{step5.witness2.name}</Text></Text>
                {step5.witness2.aadhaar && <Text style={styles.signatureText}>Aadhaar: <Text style={styles.highlight}>{step5.witness2.aadhaar}</Text></Text>}
                <Text style={styles.signatureText}>Father: <Text style={styles.highlight}>{step5.witness2.father}</Text></Text>
                <Text style={styles.signatureText}>Address: <Text style={styles.highlight}>
                  {[step5.witness2.address, step5.witness2.city, step5.witness2.state, step5.witness2.zipCode].filter(Boolean).join(', ')}
                </Text></Text>
              </>
            )}
          </View>
        </View>

        {/* Testator Signature */}
        <View style={{ marginTop: 40, borderTop: '1 solid #000', paddingTop: 10 }} wrap={false}>
          <Text style={styles.sectionLabel}>Signature of Testator</Text>
          <Text style={styles.paragraph}>( {step1.fullName} )</Text>
          <Text>Date: <Text style={styles.highlight}>{step2.signingDate}</Text></Text>
          <Text>Place: <Text style={styles.highlight}>{step2.signingPlace}</Text></Text>
        </View>

        {/* Page Number Footer */}
        <View style={styles.footerContainer} fixed>
          <Text style={{ textAlign: 'left', minWidth: 100 }}>{step1.fullName}</Text>
          <Text style={{ textAlign: 'center' }}>Initials: _______</Text>
          <Text 
            style={{ textAlign: 'right', minWidth: 100 }} 
            render={({ pageNumber, totalPages }) => (
              `Page ${pageNumber} of ${totalPages}`
            )} 
          />
        </View>
      </Page>
      {/* Appendix Page for Images */}
      {step8.assets && step8.assets.some(a => a.details?.images && a.details.images.length > 0) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.pageBorder} fixed />
          
          {step8.assets.map((asset, index) => {
            const details = asset.details as { description?: string; images?: AssetImage[] };
            if (details?.images && Array.isArray(details.images) && details.images.length > 0) {
              return (
                <View key={index} style={{ marginBottom: 20 }} wrap={false}>
                  <Text style={styles.sectionLabel}>{asset.type} - {details.description || ''}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {details.images.map((img: AssetImage, i: number) => (
                      <Image 
                        key={i} 
                        src={img.data} 
                        style={{ width: 150, height: 150, objectFit: 'cover' as any, marginBottom: 10, marginRight: 10 }} 
                      />
                    ))}
                  </View>
                </View>
              );
            }
            return null;
          })}
          
          {/* Footer */}
          <View style={styles.footerContainer} fixed>
            <Text style={{ textAlign: 'left', minWidth: 100 }}>{step1.fullName}</Text>
            <Text style={{ textAlign: 'center' }}>Initials: _______</Text>
            <Text 
              style={{ textAlign: 'right', minWidth: 100 }} 
              render={({ pageNumber, totalPages }) => (
                `Page ${pageNumber} of ${totalPages}`
              )} 
            />
          </View>
        </Page>
      )}
    </Document>
  );
};
