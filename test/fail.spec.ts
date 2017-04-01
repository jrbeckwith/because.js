// import whatever from '../index';
import { assert } from 'chai';


describe('Intentionally failing test', () => {

    beforeEach(function () {
    });

    describe('fail', () => {
        it('should fail since there are no real tests', () => {
            assert(false, 'no real tests');
        });
    });

});
