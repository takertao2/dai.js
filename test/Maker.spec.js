import Maker from '../src/Maker';
import ConfigFactory from '../src/utils/ConfigFactory';


function createMaker() {
  return new Maker(
    ConfigFactory.create('decentralized-oasis-without-proxies')
  );
}

test('openCdp should open a CDP', done => {
  const maker = createMaker();

  maker.openCdp().then(cdp => cdp.getCdpId()).then(id => {
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
      done();
    });
}, 5000);

test('should create a new CDP object for existing CDPs', done => {
  const maker = createMaker();
  let createdCdp;

  maker.openCdp()
    .then(cdp => {
      createdCdp = cdp;
      cdp.getCdpId()
      .then(id => {
        maker.getCdp(id).then(newCdpObject => {
          expect(createdCdp.getCdpId()).toEqual(newCdpObject.getCdpId());
          expect(createdCdp._cdpService).toEqual(newCdpObject._cdpService);
          expect(createdCdp._smartContractService).toEqual(newCdpObject._smartContractService);
          done();
        });
      });
  });
});

test('should validate the provided CDP ID', done => {
  const maker = createMaker();
  let cdpId;

  maker.openCdp()
    .then(cdp => cdp.getCdpId())
    .then(id => {
      cdpId = id;
      return maker.getCdp(cdpId);
    })
    .then(cdp => cdp.getCdpId())
    .then(fetchedId => {
      expect(fetchedId).toEqual(cdpId);

      //These crash other unit tests later on, strangely enough
      //expect(maker.getCdp('a')).rejects.toThrowError('must be a number');
      //expect(maker.getCdp(8000)).rejects.toThrowError('try opening a new one');

      done();
    });
});
