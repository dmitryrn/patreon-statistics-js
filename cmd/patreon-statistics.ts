import { appDo } from '../internal/patreon-statistics/patreon-statistics'

appDo()
    .then(() => {
        console.log('patreon-statistics exited without error')
    })
    .catch((err: Error) => {
        console.log('patreon-statistics do failed', err)
        process.exit(1)
    })
