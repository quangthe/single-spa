const activeHash = `#unmount-times-out-dies`;

export default function() {
	describe(`unmount-times-out app`, () => {
		let childApp;

		beforeAll(() => {
			singleSpa.declareChildApplication('./unmount-times-out-dies.app.js', () => System.import('./unmount-times-out-dies.app.js'), location => location.hash === activeHash);
		});

		beforeEach(done => {
			location.hash = activeHash;

			System
			.import('./unmount-times-out-dies.app.js')
			.then(app => childApp = app)
			.then(app => app.reset())
			.then(done)
			.catch(err => {throw err})
		})

		it(`is put into SKIP_BECAUSE_BROKEN when dieOnTimeout is true`, (done) => {
			singleSpa
			.triggerAppChange()
			.then(() => {
				expect(childApp.numBootstraps()).toEqual(1);
				expect(childApp.numMounts()).toEqual(1);
				expect(singleSpa.getMountedApps()).toEqual(['./unmount-times-out-dies.app.js']);
				expect(singleSpa.getAppStatus('./unmount-times-out-dies.app.js')).toEqual('MOUNTED');

				location.hash = '#not-unmount-times-out';
				singleSpa
				.triggerAppChange()
				.then(() => {
					expect(childApp.numUnmounts()).toEqual(1);
					expect(singleSpa.getMountedApps()).toEqual([]);
					expect(singleSpa.getAppStatus('./unmount-times-out-dies.app.js')).toEqual('SKIP_BECAUSE_BROKEN');
					done();
				})
				.catch(ex => {
					fail(ex);
					done();
				});
			})
			.catch(ex => {
				fail(ex);
				done();
			});
		});
	});
}
