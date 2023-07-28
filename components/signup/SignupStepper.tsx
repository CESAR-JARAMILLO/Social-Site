import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, Flex, StepSeparator, StepStatus, StepTitle, useSteps, useMediaQuery, Stepper } from '@chakra-ui/react'
import React from 'react'

const steps = [
  { title: 'Signup' },
  { title: 'Info' },
  { title: 'Upload' },
]

const SignupStepper = () => {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length,
  })

  // useMediaQuery
  const [isLargerThanMD] = useMediaQuery("(min-width: 768px)");

  return (
    <Flex direction={isLargerThanMD ? "row" : "column"}>
      <Stepper index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              {/* <StepDescription>{step.description}</StepDescription> */}
            </Box>
  
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Flex>
  )
}

export default SignupStepper
