import Layout from '@/components/custom/layout'
import React, { Suspense } from 'react'

const AboutPage = () => {
    return (
        <Suspense fallback={<div>Loading layout...</div>}>
            <Layout>
                <div>AboutPage</div>
            </Layout>
        </Suspense>
    )
}

export default AboutPage