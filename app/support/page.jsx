import Layout from '@/components/custom/layout'
import React, { Suspense } from 'react'

const SupportPage = () => {
    return (
        <Suspense fallback={<div>Loading layout...</div>}>
            <Layout>
                <div>
                    <div>SupportPage</div>
                </div>
            </Layout>
        </Suspense>
    )
}

export default SupportPage