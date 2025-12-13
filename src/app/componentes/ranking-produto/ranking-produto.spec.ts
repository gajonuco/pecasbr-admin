import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingProduto } from './ranking-produto';

describe('RankingProduto', () => {
  let component: RankingProduto;
  let fixture: ComponentFixture<RankingProduto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingProduto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingProduto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
