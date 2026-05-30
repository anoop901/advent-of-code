import sys
from dataclasses import dataclass
import copy


@dataclass
class PresentShape:
    dimensions: tuple[int, int]
    grid: list[list[bool]]


@dataclass
class RegionSpec:
    dimensions: tuple[int, int]
    num_presents_by_shape: list[int]


@dataclass
class Region:
    dimensions: tuple[int, int]
    grid: list[list[bool]]


def parse_input():
    input_str = sys.stdin.read()
    sections = input_str.split("\n\n")
    shape_sections = sections[:-1]
    shape_sections = [section.splitlines()[1:] for section in shape_sections]
    shape_grids = [
        [[x == "#" for x in row] for row in shape_section]
        for shape_section in shape_sections
    ]
    present_shapes = [
        PresentShape(dimensions=(len(shape_grid[0]), len(shape_grid)), grid=shape_grid)
        for shape_grid in shape_grids
    ]

    region_specs = []
    region_section = sections[-1]
    for region_str in region_section.splitlines():
        dims_str, num_presents_by_shape_str = region_str.split(": ")
        dimensions = tuple(int(d) for d in dims_str.split("x"))
        dimensions = dimensions[1], dimensions[0]
        num_presents_by_shape = [int(x) for x in num_presents_by_shape_str.split(" ")]
        region_specs.append(RegionSpec(dimensions, num_presents_by_shape))

    return present_shapes, region_specs


def create_empty_region(dimensions: tuple[int, int]) -> Region:
    grid = [[False for _ in range(dimensions[1])] for _ in range(dimensions[0])]
    return Region(dimensions, grid)


def print_region(region: Region):
    for row in region.grid:
        print(" ".join("#" if x else "." for x in row))
    print()


def blit_region_if_fits(
    region: Region,
    present_shape: PresentShape,
    offset: tuple[int, int],
    flipX: bool = False,
    flipY: bool = False,
    flipDiag: bool = False,
):
    h, w = present_shape.dimensions
    shape_grid = present_shape.grid

    shape_offsets = [(y, x) for y in range(h) for x in range(w)]
    transformed_offsets = []

    for shape_offset in shape_offsets:
        transformed_offset = shape_offset
        if flipX:
            transformed_offset = (transformed_offset[0], w - 1 - transformed_offset[1])
        if flipY:
            transformed_offset = (h - 1 - transformed_offset[0], transformed_offset[1])
        if flipDiag:
            transformed_offset = (transformed_offset[1], transformed_offset[0])
        transformed_offset = (
            offset[0] + transformed_offset[0],
            offset[1] + transformed_offset[1],
        )
        if shape_grid[shape_offset[0]][shape_offset[1]]:
            transformed_offsets.append(transformed_offset)

    for transformed_offset in transformed_offsets:
        if region.grid[transformed_offset[0]][transformed_offset[1]]:
            return None

    region = copy.deepcopy(region)

    for transformed_offset in transformed_offsets:
        region.grid[transformed_offset[0]][transformed_offset[1]] = True
    return region


def possible_blits(region: Region, shape: PresentShape):
    blits = [
        blit_region_if_fits(region, shape, (y, x), flipX, flipY, flipDiag)
        for y in range(region.dimensions[0] - shape.dimensions[0] + 1)
        for x in range(region.dimensions[1] - shape.dimensions[1] + 1)
        for flipX in [False, True]
        for flipY in [False, True]
        for flipDiag in [False, True]
    ]
    return [b for b in blits if b]


def presents_fit_in_region(region: Region, presents: list[PresentShape]):
    if not presents:
        return True
    presents = copy.deepcopy(presents)
    present = presents.pop()
    blits = possible_blits(region, present)
    for region_blit in blits:
        if presents_fit_in_region(region_blit, presents):
            print_region(region_blit)
            return True
    return False


def part1():
    present_shapes, region_specs = parse_input()
    return sum(
        sum(region_spec.num_presents_by_shape)
        <= ((region_spec.dimensions[0] // 3) * (region_spec.dimensions[1] // 3))
        for region_spec in region_specs
    )
    # for region_spec in region_specs:
    #     shapes_to_fit = sum(
    #         (
    #             [present_shapes[shape_idx]] * num
    #             for shape_idx, num in enumerate(region_spec.num_presents_by_shape)
    #         ),
    #         [],
    #     )
    #     region = create_empty_region(region_spec.dimensions)
    #     print(presents_fit_in_region(region, shapes_to_fit))


print(part1())
