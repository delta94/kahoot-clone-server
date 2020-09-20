import * as express from 'express';
import KahootModel from './kahoot.model';
import CrudController from '@/modules/Common/crudController';
import requireAuth from '@/middlewares/auth.middleware';
import Controller from '@/interfaces/controller.interface';
import status from 'http-status';
import Response from '@/helpers/response.helper';

class KahootController extends CrudController implements Controller {
  public path = '/kahoots';
  model = KahootModel;

  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    this.router.post(this.path, requireAuth, this.post);
    this.router.get(this.path, requireAuth, this.getAll);
    this.router.put(`${this.path}/:id`, requireAuth, this.update);
    this.router.get(`${this.path}/:id`, requireAuth, this.getKahoot);
    this.router.delete(`${this.path}/:id`, requireAuth, this.deleteById);
  };
  private getKahoot = async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.params;
      const data = await this.model.findById(id).populate('questions').lean();
      if (!data) {
        return Response(
          res,
          {
            message: `${id} not found`
          },
          status.NOT_FOUND
        );
      }
      return Response(res, { data });
    } catch (error) {
      return Response(res, { error: error }, status.INTERNAL_SERVER_ERROR);
    }
  };
}
export default KahootController;
