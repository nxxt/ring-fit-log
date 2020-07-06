import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Week } from '~/types/setting'

@Module({
  name: 'setting',
  stateFactory: true,
  namespaced: true
})
export default class SettingModule extends VuexModule {
  private firstDayOfWeek: Week = 0

  public get getFirstDayOfWeek() {
    return this.firstDayOfWeek
  }

  @Mutation
  private setFirstDayOfWeek(week: Week) {
    this.firstDayOfWeek = week
  }

  @Action({ rawError: true })
  public changeFirstDayOfWeek(week: Week) {
    this.setFirstDayOfWeek(week)
  }
}