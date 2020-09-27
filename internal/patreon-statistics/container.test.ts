import { newContainer } from './container'

test('test', () => {
    const container = newContainer()

    expect(container.userController).toBeTruthy()
    expect(() => container.server).toThrow(/Server config has not been set/)

    container.setServerConfig({
        port: 123,
        routes: [],
    })

    expect(container.server).toBeTruthy()
})
