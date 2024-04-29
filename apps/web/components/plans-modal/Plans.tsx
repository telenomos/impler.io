import React, { useState } from 'react';
import { Flex, Switch, Stack, Container, Skeleton } from '@mantine/core';
import { Plan } from './Plan';
import { usePlanDetails } from '@hooks/usePlanDetails';

interface PlansProps {
  profile: IProfileData;
}

export const Plans = ({ profile }: PlansProps) => {
  const plans = {
    monthly: [
      {
        name: 'Sandbox',
        code: 'SANDBOX',
        rowsIncluded: 5000,
        price: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Starter',
        code: 'STARTER-MONTHLY',
        rowsIncluded: 5000,
        price: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Growth',
        code: 'GROWTH-MONTHLY',
        price: 42,
        rowsIncluded: 500000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
      {
        name: 'Scale',
        code: 'SCALE-MONTHLY',
        price: 90,
        rowsIncluded: 1500000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
    ],
    yearly: [
      {
        name: 'Sandbox',
        code: 'SANDBOX',
        rowsIncluded: 5000,
        price: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Starter',
        code: 'STARTER-YEARLY',
        price: 0,
        rowsIncluded: 5000,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Growth',
        code: 'GROWTH-YEARLY',
        yearlyPrice: 420,
        price: 35,
        rowsIncluded: 500000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
      {
        name: 'Scale',
        code: 'SCALE-YEARLY',
        yearlyPrice: 900,
        price: 75,
        rowsIncluded: 1500000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
    ],
  };
  const [switchPlans, setSwitchPlans] = useState<boolean>(false);
  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({
    email: profile.email,
  });

  return (
    <Container size="xl" fluid={true}>
      <Stack align="center">
        <Switch
          size="lg"
          label="Yearly"
          checked={switchPlans}
          onChange={(event) => setSwitchPlans(event.currentTarget.checked)}
        />
        <Flex w="100%" gap="sm" direction="row" align="stretch" maw="100%">
          {plans[switchPlans ? 'yearly' : 'monthly'].map((plan, index) =>
            isActivePlanLoading ? (
              <Skeleton key={index} height={500} width={250} />
            ) : (
              <Plan
                key={index}
                name={plan.name}
                rowsIncluded={plan.rowsIncluded}
                price={plan.price}
                planCode={plan?.code}
                isActive={activePlanDetails?.isActive && activePlanDetails.plan.code === plan.code}
                userProfile={profile}
                switchPlans={switchPlans}
                showButton={plan.code !== 'SANDBOX'}
                removeBranding={plan.removeBranding}
                customValidation={plan.customValidation}
                outputCustomization={plan.outputCustomization}
                extraCharge={plan.extraChargeOverheadTenThusandRecords}
                yearlyPrice={plan.yearlyPrice}
              />
            )
          )}
        </Flex>
      </Stack>
    </Container>
  );
};

export default Plans;
