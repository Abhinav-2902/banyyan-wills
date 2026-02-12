import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CompleteWillFormData } from '@/lib/validations/will';

// Define styles matching Indian legal Will format
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    lineHeight: 1.6,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Times-Bold',
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontFamily: 'Times-Bold',
    marginBottom: 5,
  },
  paragraph: {
    textAlign: 'justify',
    marginBottom: 8,
  },
  indent: {
    marginLeft: 20,
  },
  doubleIndent: {
    marginLeft: 40,
  },
  listItem: {
    marginBottom: 6,
    marginLeft: 30,
  },
  subListItem: {
    marginLeft: 50,
    marginBottom: 4,
  },
  highlight: {
    color: '#DC143C',
    fontFamily: 'Times-Bold',
  },
  underline: {
    textDecoration: 'underline',
  },
  witnessSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  signatureBlock: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureColumn: {
    width: '45%',
  },
  signatureLine: {
    borderBottom: '1 solid black',
    marginTop: 40,
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ccc',
    paddingVertical: 5,
  },
  tableHeader: {
    fontFamily: 'Times-Bold',
    backgroundColor: '#f0f0f0',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
});

interface WillPDFTemplateProps {
  data: CompleteWillFormData;
}

export const WillPDFDocument: React.FC<WillPDFTemplateProps> = ({ data }) => {
  const { step1, step2, step3, step4, step5, step6, step7 } = data;

  // Helper to format beneficiary distribution
  const getBeneficiaryText = () => {
    if (step4.distributionType === 'Equal distribution') {
      return 'equally distributed';
    }
    return 'distributed as per specified percentages';
  };

  // Helper to get primary beneficiary
  const getPrimaryBeneficiary = () => {
    if (!step4.beneficiaries || step4.beneficiaries.length === 0) return null;
    if (step4.distributionType === 'Equal distribution') {
      return step4.beneficiaries[0];
    }
    return step4.beneficiaries.reduce((prev, current) => 
      (current.sharePercentage > prev.sharePercentage) ? current : prev
    );
  };

  const primaryBeneficiary = getPrimaryBeneficiary();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>WILL OF {step1.fullName.toUpperCase()}</Text>

        {/* Section A: Testator Details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>A. TESTATOR DETAILS</Text>
          <Text style={styles.paragraph}>
            I, <Text style={styles.highlight}>{step1.fullName}</Text>, {step1.gender}, aged{' '}
            <Text style={styles.highlight}>{step1.age} years</Text>, son/daughter of{' '}
            <Text style={styles.highlight}>{step1.fatherMotherName}</Text>, born on{' '}
            <Text style={styles.highlight}>{step1.dateOfBirth}</Text>, by religion{' '}
            <Text style={styles.highlight}>{step1.religion || 'Hindu'}</Text>, by occupation{' '}
            <Text style={styles.highlight}>{step1.occupation || 'N/A'}</Text>, presently{' '}
            <Text style={styles.highlight}>{step1.maritalStatus}</Text>, having PAN No.{' '}
            <Text style={styles.highlight}>{step1.panNumber || 'N/A'}</Text>, Aadhaar No.{' '}
            <Text style={styles.highlight}>{step1.aadhaarNumber || 'N/A'}</Text>, a resident of{' '}
            <Text style={styles.highlight}>
              {step1.residentialAddress.addressLine1}
              {step1.residentialAddress.addressLine2 && `, ${step1.residentialAddress.addressLine2}`},{' '}
              {step1.residentialAddress.city}, {step1.residentialAddress.state},{' '}
              {step1.residentialAddress.pinCode}, {step1.residentialAddress.country}
            </Text>, contact number{' '}
            <Text style={styles.highlight}>{step1.contactInfo.mobileNumber}</Text>, email{' '}
            <Text style={styles.highlight}>{step1.contactInfo.emailAddress}</Text>, and my mother&apos;s name being Smt.{' '}
            <Text style={styles.highlight}>{step2.mother.name}</Text> do hereby make my following Will and Testament which I make and execute at{' '}
            <Text style={styles.highlight}>{step7.placeOfExecution}</Text> on{' '}
            <Text style={styles.highlight}>{step7.dateOfExecution || new Date().toISOString().split('T')[0]}</Text>.
          </Text>
        </View>

        {/* Section B: Sound Mind Declaration */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>B. DECLARATION OF SOUND MIND</Text>
          <Text style={styles.paragraph}>
            I the above named declare that I am in good health and possess a sound mind. I am writing this will out of my free volition and without any coercion, persuasion or undue influence whatsoever and out of my own independent decision only.
          </Text>
        </View>

        {/* Section C: Family Details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>C. FAMILY DETAILS</Text>
          <Text style={styles.paragraph}>
            My father, Shri. <Text style={styles.highlight}>{step2.father.name}</Text>, is{' '}
            <Text style={styles.highlight}>{step2.father.status}</Text>
            {step2.father.dateOfBirth && <>, born on <Text style={styles.highlight}>{step2.father.dateOfBirth}</Text></>}
            {step2.father.address && <>, residing at <Text style={styles.highlight}>{step2.father.address}</Text></>}.
          </Text>
          
          {step2.isMarried && step2.spouse && (
            <Text style={styles.paragraph}>
              I am married to <Text style={styles.highlight}>{step2.spouse.fullName}</Text>, born on{' '}
              <Text style={styles.highlight}>{step2.spouse.dateOfBirth}</Text>, PAN No.{' '}
              <Text style={styles.highlight}>{step2.spouse.panNumber || 'N/A'}</Text>. We were married on{' '}
              <Text style={styles.highlight}>{step2.spouse.marriageDate}</Text>
              {step2.spouse.marriageRegistrationNumber && (
                <>, Marriage Registration No. <Text style={styles.highlight}>{step2.spouse.marriageRegistrationNumber}</Text></>
              )}.
            </Text>
          )}

          {step2.hasChildren && step2.children && step2.children.length > 0 && (
            <>
              <Text style={styles.paragraph}>
                I have <Text style={styles.highlight}>{step2.numberOfChildren}</Text> child/children:
              </Text>
              {step2.children.map((child, index) => (
                <Text key={index} style={styles.listItem}>
                  {index + 1}. <Text style={styles.highlight}>{child.fullName}</Text>, {child.relationship},{' '}
                  {child.gender}, born on <Text style={styles.highlight}>{child.dateOfBirth}</Text>{' '}
                  ({child.isMinor ? 'Minor' : 'Major'}), PAN: {child.panNumber || 'N/A'}, Aadhaar: {child.aadhaarNumber || 'N/A'}
                  {child.currentAddress && <>, residing at {child.currentAddress}</>}.
                </Text>
              ))}
            </>
          )}

          {step2.hasSiblings && step2.siblings && step2.siblings.length > 0 && (
            <>
              <Text style={styles.paragraph}>I have the following siblings:</Text>
              {step2.siblings.map((sibling, index) => (
                <Text key={index} style={styles.listItem}>
                  {index + 1}. <Text style={styles.highlight}>{sibling.fullName}</Text>, {sibling.relationship}
                  {sibling.contactDetails && <>, Contact: {sibling.contactDetails}</>}.
                </Text>
              ))}
            </>
          )}
        </View>

        {/* Section D: Executor Details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>D. EXECUTOR APPOINTMENT</Text>
          <Text style={styles.paragraph}>
            I appoint <Text style={styles.highlight}>{step6.primaryExecutor.fullName}</Text>, {step6.primaryExecutor.relationship},{' '}
            born on <Text style={styles.highlight}>{step6.primaryExecutor.dateOfBirth}</Text>, aged{' '}
            <Text style={styles.highlight}>{step6.primaryExecutor.age} years</Text>, occupation{' '}
            <Text style={styles.highlight}>{step6.primaryExecutor.occupation || 'N/A'}</Text>, PAN No.{' '}
            <Text style={styles.highlight}>{step6.primaryExecutor.panNumber || 'N/A'}</Text>, resident of{' '}
            <Text style={styles.highlight}>
              {step6.primaryExecutor.address.addressLine1}, {step6.primaryExecutor.address.city},{' '}
              {step6.primaryExecutor.address.state}, {step6.primaryExecutor.address.pinCode}
            </Text>, contact number <Text style={styles.highlight}>{step6.primaryExecutor.mobileNumber}</Text>{' '}
            to be the Executor of this Will.
            {step6.hasAlternateExecutor && step6.alternateExecutor && (
              <>
                {' '}In the event of death of <Text style={styles.highlight}>{step6.primaryExecutor.fullName}</Text> or if{' '}
                <Text style={styles.highlight}>{step6.primaryExecutor.fullName}</Text> is unable to perform the duties of the Executor for any reason whatsoever then{' '}
                <Text style={styles.highlight}>{step6.alternateExecutor.fullName}</Text>, {step6.alternateExecutor.relationship},{' '}
                born on <Text style={styles.highlight}>{step6.alternateExecutor.dateOfBirth}</Text>, resident of{' '}
                <Text style={styles.highlight}>
                  {step6.alternateExecutor.address.addressLine1}, {step6.alternateExecutor.address.city},{' '}
                  {step6.alternateExecutor.address.state}
                </Text>, contact <Text style={styles.highlight}>{step6.alternateExecutor.mobileNumber}</Text>{' '}
                will be the Executor of this Will.
              </>
            )}
          </Text>
          <Text style={styles.paragraph}>
            The Executor is hereby granted the following powers: 
            {step6.powers.canSellProperty && ' to sell property,'}
            {step6.powers.canManageInvestments && ' to manage investments,'}
            {step6.powers.canSettleDebts && ' to settle debts,'}
            {step6.powers.canDistributeAssets && ' to distribute assets'}
            {' '}as per the terms of this Will.
          </Text>
          {step6.remuneration && step6.remuneration !== 'No remuneration' && (
            <Text style={styles.paragraph}>
              Executor remuneration: <Text style={styles.highlight}>{step6.remuneration}</Text>
              {step6.remunerationAmount && <> of <Text style={styles.highlight}>₹{step6.remunerationAmount}</Text></>}.
            </Text>
          )}
        </View>
      </Page>

      {/* Page 2 - Guardianship and Assets */}
      <Page size="A4" style={styles.page}>
        {/* Section E: Guardianship (if minor children) */}
        {step5.hasMinorChildren && step5.primaryGuardian && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>E. GUARDIANSHIP OF MINOR CHILDREN</Text>
            <Text style={styles.paragraph}>
              I appoint <Text style={styles.highlight}>{step5.primaryGuardian.fullName}</Text>, {step5.primaryGuardian.relationship},{' '}
              born on <Text style={styles.highlight}>{step5.primaryGuardian.dateOfBirth}</Text>, occupation{' '}
              <Text style={styles.highlight}>{step5.primaryGuardian.occupation || 'N/A'}</Text>, residing at{' '}
              <Text style={styles.highlight}>{step5.primaryGuardian.address}</Text>, contact number{' '}
              <Text style={styles.highlight}>{step5.primaryGuardian.mobileNumber}</Text> as the Guardian of my minor children.
              {step5.alternateGuardian && (
                <>
                  {' '}In the event that <Text style={styles.highlight}>{step5.primaryGuardian.fullName}</Text> is unable or unwilling to act as Guardian, I appoint{' '}
                  <Text style={styles.highlight}>{step5.alternateGuardian.fullName}</Text>, {step5.alternateGuardian.relationship},{' '}
                  residing at <Text style={styles.highlight}>{step5.alternateGuardian.address}</Text> as the Alternate Guardian.
                </>
              )}
            </Text>
            {step5.specialInstructions && (
              <>
                {step5.specialInstructions.childCare && (
                  <Text style={styles.paragraph}>
                    <Text style={styles.underline}>Child Care Instructions:</Text> {step5.specialInstructions.childCare}
                  </Text>
                )}
                {step5.specialInstructions.educationPreferences && (
                  <Text style={styles.paragraph}>
                    <Text style={styles.underline}>Education Preferences:</Text> {step5.specialInstructions.educationPreferences}
                  </Text>
                )}
                {step5.specialInstructions.religiousCulturalUpbringing && (
                  <Text style={styles.paragraph}>
                    <Text style={styles.underline}>Religious/Cultural Upbringing:</Text> {step5.specialInstructions.religiousCulturalUpbringing}
                  </Text>
                )}
              </>
            )}
          </View>
        )}

        {/* Section F/G: Immovable Property */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{step5.hasMinorChildren ? 'F' : 'E'}. IMMOVABLE PROPERTY</Text>
          <Text style={styles.paragraph}>
            I bequeath the following immovable properties:
          </Text>
          {step3.hasImmovableProperty && step3.immovableProperties && step3.immovableProperties.length > 0 ? (
            step3.immovableProperties.map((property, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.paragraph}>
                  {index + 1}. <Text style={styles.underline}>{property.propertyType}</Text>
                </Text>
                <Text style={styles.subListItem}>
                  Description: <Text style={styles.highlight}>{property.description}</Text>
                </Text>
                <Text style={styles.subListItem}>
                  Address: <Text style={styles.highlight}>
                    {property.address.addressLine1}, {property.address.city}, {property.address.state}, {property.address.pinCode}
                  </Text>
                </Text>
                {property.surveyPlotNumber && (
                  <Text style={styles.subListItem}>
                    Survey/Plot No.: <Text style={styles.highlight}>{property.surveyPlotNumber}</Text>
                  </Text>
                )}
                <Text style={styles.subListItem}>
                  Area: <Text style={styles.highlight}>{property.areaSize} {property.areaUnit}</Text>
                </Text>
                <Text style={styles.subListItem}>
                  Ownership: <Text style={styles.highlight}>{property.ownershipType}</Text>
                  {property.coOwnerNames && <>, Co-owners: <Text style={styles.highlight}>{property.coOwnerNames}</Text></>}
                  {property.sharePercentage && <>, My share: <Text style={styles.highlight}>{property.sharePercentage}%</Text></>}
                </Text>
                {property.propertyDocumentNumber && (
                  <Text style={styles.subListItem}>
                    Document No.: <Text style={styles.highlight}>{property.propertyDocumentNumber}</Text>
                    {property.registrationDate && <>, Registered on: {property.registrationDate}</>}
                    {property.subRegistrarOffice && <>, at {property.subRegistrarOffice}</>}
                  </Text>
                )}
                {property.approximateValue && (
                  <Text style={styles.subListItem}>
                    Approximate Value: <Text style={styles.highlight}>₹{property.approximateValue.toLocaleString('en-IN')}</Text>
                  </Text>
                )}
                {property.hasLoan && property.loanDetails && (
                  <Text style={styles.subListItem}>
                    Loan: <Text style={styles.highlight}>{property.loanDetails.bankName}</Text>
                    {property.loanDetails.loanAccountNumber && <>, A/c: {property.loanDetails.loanAccountNumber}</>}
                    {property.loanDetails.outstandingAmount && <>, Outstanding: ₹{property.loanDetails.outstandingAmount.toLocaleString('en-IN')}</>}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.listItem}>None declared</Text>
          )}
        </View>
      </Page>

      {/* Page 3 - Movable Assets */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{step5.hasMinorChildren ? 'G' : 'F'}. MOVABLE ASSETS</Text>
          
          {/* Bank Accounts */}
          {step3.hasBankAccounts && step3.bankAccounts && step3.bankAccounts.length > 0 && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Bank Accounts:</Text> Entire bank balance in all my accounts including:
              </Text>
              {step3.bankAccounts.map((account, index) => (
                <Text key={index} style={styles.subListItem}>
                  {String.fromCharCode(97 + index)}. {account.accountType} A/c No.{' '}
                  <Text style={styles.highlight}>{account.accountNumber}</Text> with{' '}
                  <Text style={styles.highlight}>{account.bankName}</Text>
                  {account.branchName && <>, {account.branchName}</>}
                  {account.accountHolderType === 'Joint' && account.jointHolderNames && (
                    <>, Joint with: <Text style={styles.highlight}>{account.jointHolderNames}</Text> ({account.jointHolderRelationship})</>
                  )}
                  {account.approximateBalance && <>, Balance: ₹{account.approximateBalance.toLocaleString('en-IN')}</>}
                  {account.nomineeRegistered && <>, Nominee registered</>}
                </Text>
              ))}
            </>
          )}

          {/* Investments */}
          {step3.hasInvestments && step3.investments && step3.investments.length > 0 && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Investments:</Text>
              </Text>
              {step3.investments.map((investment, index) => (
                <Text key={index} style={styles.subListItem}>
                  {String.fromCharCode(97 + index)}. <Text style={styles.underline}>{investment.investmentType}</Text> -{' '}
                  {investment.description} held with <Text style={styles.highlight}>{investment.institutionCompanyName}</Text>
                  {investment.folioAccountPolicyNumber && <>, Folio/A/c: {investment.folioAccountPolicyNumber}</>}
                  {investment.approximateValue && <>, Value: ₹{investment.approximateValue.toLocaleString('en-IN')}</>}
                  {investment.nomineeRegistered && <>, Nominee registered</>}
                </Text>
              ))}
            </>
          )}

          {/* Vehicles */}
          {step3.hasVehicles && step3.vehicles && step3.vehicles.length > 0 && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Vehicles:</Text>
              </Text>
              {step3.vehicles.map((vehicle, index) => (
                <Text key={index} style={styles.subListItem}>
                  {String.fromCharCode(97 + index)}. {vehicle.vehicleType} <Text style={styles.highlight}>{vehicle.makeModel}</Text>{' '}
                  having Registration No. <Text style={styles.highlight}>{vehicle.registrationNumber}</Text>
                  {vehicle.yearOfPurchase && <>, Year: {vehicle.yearOfPurchase}</>}
                  {vehicle.approximateValue && <>, Value: ₹{vehicle.approximateValue.toLocaleString('en-IN')}</>}
                </Text>
              ))}
            </>
          )}

          {/* Jewelry */}
          {step3.hasJewelryValuables && step3.jewelryValuables && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Jewelry and Valuables:</Text>
              </Text>
              <Text style={styles.subListItem}>
                Description: <Text style={styles.highlight}>{step3.jewelryValuables.description}</Text>
                {step3.jewelryValuables.locationStorage && <>, stored at {step3.jewelryValuables.locationStorage}</>}
                {step3.jewelryValuables.approximateValue && <>, Value: ₹{step3.jewelryValuables.approximateValue.toLocaleString('en-IN')}</>}
              </Text>
            </>
          )}

          {/* Business Interests */}
          {step3.hasBusinessInterests && step3.businessInterests && step3.businessInterests.length > 0 && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Business Interests:</Text>
              </Text>
              {step3.businessInterests.map((business, index) => (
                <Text key={index} style={styles.subListItem}>
                  {String.fromCharCode(97 + index)}. <Text style={styles.highlight}>{business.businessName}</Text>, {business.businessType},{' '}
                  Ownership: {business.ownershipPercentage}%
                  {business.registrationNumber && <>, Reg. No.: {business.registrationNumber}</>}
                  {business.businessAddress && <>, Address: {business.businessAddress}</>}
                </Text>
              ))}
            </>
          )}

          {/* Digital Assets */}
          {step3.hasDigitalAssets && step3.digitalAssets && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Digital Assets:</Text>
              </Text>
              <Text style={styles.subListItem}>
                Asset Types: <Text style={styles.highlight}>{step3.digitalAssets.assetTypes.join(', ')}</Text>
                {step3.digitalAssets.accessInstructions && (
                  <>, Access Instructions: {step3.digitalAssets.accessInstructions}</>
                )}
              </Text>
            </>
          )}
        </View>
      </Page>

      {/* Page 4 - Beneficiaries and Distribution */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{step5.hasMinorChildren ? 'H' : 'G'}. BENEFICIARIES AND DISTRIBUTION</Text>
          <Text style={styles.paragraph}>
            I bequeath all my assets, properties, rights, and interests as mentioned above to the following beneficiaries in the manner specified:
          </Text>
          <Text style={styles.paragraph}>
            Distribution Type: <Text style={styles.highlight}>{step4.distributionType}</Text>
          </Text>
          
          {step4.beneficiaries.map((beneficiary, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.paragraph}>
                {index + 1}. <Text style={styles.highlight}>{beneficiary.fullName}</Text>, {beneficiary.relationship},{' '}
                {beneficiary.gender}
                {beneficiary.dateOfBirth && <>, born on {beneficiary.dateOfBirth}</>}
                {beneficiary.isMinor && <> (Minor)</>}
              </Text>
              <Text style={styles.subListItem}>
                Share: <Text style={styles.highlight}>{beneficiary.sharePercentage}%</Text>
              </Text>
              <Text style={styles.subListItem}>
                PAN: {beneficiary.panNumber || 'N/A'}, Aadhaar: {beneficiary.aadhaarNumber || 'N/A'}
              </Text>
              <Text style={styles.subListItem}>
                Address: {beneficiary.address.addressLine1}, {beneficiary.address.city},{' '}
                {beneficiary.address.state}, {beneficiary.address.pinCode}
              </Text>
              {beneficiary.mobileNumber && (
                <Text style={styles.subListItem}>Contact: {beneficiary.mobileNumber}</Text>
              )}
              {beneficiary.specificAssets && (
                <Text style={styles.subListItem}>
                  Specific Assets: <Text style={styles.highlight}>{beneficiary.specificAssets}</Text>
                </Text>
              )}
            </View>
          ))}

          {step4.conditionalBequests && step4.conditionalBequests.length > 0 && (
            <>
              <Text style={styles.paragraph}>
                <Text style={styles.underline}>Conditional Bequests:</Text>
              </Text>
              {step4.conditionalBequests.map((bequest, index) => (
                <Text key={index} style={styles.subListItem}>
                  {index + 1}. To <Text style={styles.highlight}>{bequest.beneficiaryName}</Text>: {bequest.conditionDescription}
                  {bequest.alternativeBeneficiary && (
                    <>, Alternative: <Text style={styles.highlight}>{bequest.alternativeBeneficiary}</Text></>
                  )}
                </Text>
              ))}
            </>
          )}

          {step4.residuaryBeneficiary && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Residuary Beneficiary:</Text> Any assets not specifically mentioned shall go to{' '}
              <Text style={styles.highlight}>{step4.residuaryBeneficiary.name}</Text>, {step4.residuaryBeneficiary.relationship}.
            </Text>
          )}
        </View>

        {/* Debts and Liabilities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{step5.hasMinorChildren ? 'I' : 'H'}. DEBTS AND LIABILITIES</Text>
          {step3.hasDebts && step3.debts && step3.debts.length > 0 ? (
            <>
              <Text style={styles.paragraph}>
                All my liabilities, debts, and dues owed by me, and the Executor fees and expenses shall be paid from my estate. My outstanding debts are:
              </Text>
              {step3.debts.map((debt, index) => (
                <Text key={index} style={styles.listItem}>
                  {index + 1}. <Text style={styles.underline}>{debt.debtType}</Text> - Creditor:{' '}
                  <Text style={styles.highlight}>{debt.creditorName}</Text>, Outstanding Amount:{' '}
                  <Text style={styles.highlight}>₹{debt.outstandingAmount.toLocaleString('en-IN')}</Text>
                  {debt.accountLoanNumber && <>, A/c: {debt.accountLoanNumber}</>}
                </Text>
              ))}
              {step3.hasBankAccounts && step3.bankAccounts.length > 0 && (
                <Text style={styles.paragraph}>
                  These debts shall be paid from Bank Account No.{' '}
                  <Text style={styles.highlight}>{step3.bankAccounts[0].accountNumber}</Text> with{' '}
                  <Text style={styles.highlight}>{step3.bankAccounts[0].bankName}</Text>.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.paragraph}>
              I declare that I have no outstanding debts or liabilities at the time of executing this Will. Any debts or liabilities that may arise shall be paid from my estate before distribution to beneficiaries.
            </Text>
          )}
        </View>
      </Page>

      {/* Page 5 - Additional Provisions and Signatures */}
      <Page size="A4" style={styles.page}>
        {/* Additional Provisions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{step5.hasMinorChildren ? 'J' : 'I'}. ADDITIONAL PROVISIONS</Text>
          
          {step7.hasPreviousWill && (
            <Text style={styles.paragraph}>
              I hereby revoke all previous Wills, Codicils, and testamentary dispositions made by me
              {step7.previousWillDate && <> including the Will dated <Text style={styles.highlight}>{step7.previousWillDate}</Text></>}.
              This Will supersedes all previous Wills.
            </Text>
          )}

          {step7.funeralInstructions && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Funeral Instructions:</Text> {step7.funeralInstructions}
            </Text>
          )}

          {step7.burialCremationPreference && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Burial/Cremation Preference:</Text> {step7.burialCremationPreference}
            </Text>
          )}

          {step7.religiousCeremonyPreferences && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Religious Ceremony Preferences:</Text> {step7.religiousCeremonyPreferences}
            </Text>
          )}

          {step7.organDonationWishes && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Organ Donation:</Text> {step7.organDonationWishes}
            </Text>
          )}

          {step7.businessContinuationInstructions && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Business Continuation:</Text> {step7.businessContinuationInstructions}
            </Text>
          )}

          {step7.petCareInstructions && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Pet Care:</Text> {step7.petCareInstructions}
            </Text>
          )}

          {step7.charitableDonations && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Charitable Donations:</Text> {step7.charitableDonations}
            </Text>
          )}

          {step7.assetDistributionInstructions && (
            <Text style={styles.paragraph}>
              <Text style={styles.underline}>Asset Distribution Instructions:</Text> {step7.assetDistributionInstructions}
            </Text>
          )}

          <Text style={styles.paragraph}>
            In case of any dispute on any matter and in any manner with any party with respect to my movable or immovable assets, the final decision will rest with the Executor appointed herein.
          </Text>
        </View>

        {/* Witnesses Section */}
        <View style={styles.witnessSection}>
          <Text style={styles.sectionLabel}>ATTESTATION BY WITNESSES</Text>
          <Text style={styles.paragraph}>
            We hereby attest that this Will has been signed by Shri/Smt. <Text style={styles.highlight}>{step1.fullName}</Text> as{' '}
            {step1.gender === 'Male' ? 'his' : step1.gender === 'Female' ? 'her' : 'their'} last Will at{' '}
            <Text style={styles.highlight}>{step7.placeOfExecution}</Text> on{' '}
            <Text style={styles.highlight}>{step7.dateOfExecution}</Text> in the joint presence of the testator and us.{' '}
            The testator is in sound mind and made this Will without any coercion.
          </Text>
        </View>

        {/* Signature Blocks */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureColumn}>
            <Text style={styles.sectionLabel}>Witness 1</Text>
            <View style={styles.signatureLine} />
            <Text>Name: <Text style={styles.highlight}>{step7.witness1.fullName}</Text></Text>
            <Text>Age: <Text style={styles.highlight}>{step7.witness1.age} years</Text></Text>
            <Text>Occupation: <Text style={styles.highlight}>{step7.witness1.occupation || 'N/A'}</Text></Text>
            <Text>Relationship: <Text style={styles.highlight}>{step7.witness1.relationship}</Text></Text>
            <Text>Address: <Text style={styles.highlight}>{step7.witness1.address}</Text></Text>
          </View>

          <View style={styles.signatureColumn}>
            <Text style={styles.sectionLabel}>Witness 2</Text>
            <View style={styles.signatureLine} />
            <Text>Name: <Text style={styles.highlight}>{step7.witness2.fullName}</Text></Text>
            <Text>Age: <Text style={styles.highlight}>{step7.witness2.age} years</Text></Text>
            <Text>Occupation: <Text style={styles.highlight}>{step7.witness2.occupation || 'N/A'}</Text></Text>
            <Text>Relationship: <Text style={styles.highlight}>{step7.witness2.relationship}</Text></Text>
            <Text>Address: <Text style={styles.highlight}>{step7.witness2.address}</Text></Text>
          </View>
        </View>

        {/* Testator Signature */}
        <View style={{ marginTop: 60 }}>
          <Text style={styles.sectionLabel}>Signature of Testator</Text>
          <View style={styles.signatureLine} />
          <Text>(<Text style={styles.highlight}>{step1.fullName}</Text>)</Text>
          <Text>Date: <Text style={styles.highlight}>{step7.dateOfExecution}</Text></Text>
          <Text>Place: <Text style={styles.highlight}>{step7.placeOfExecution}</Text></Text>
        </View>
      </Page>
    </Document>
  );
};
